import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { I18NextService } from 'angular-i18next';
import { Subscription, timer } from 'rxjs';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { InfoComponent } from 'src/syndicate/components/modals/info/info.component';
import { DevicesService } from 'src/syndicate/services/devices.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { environment } from '../../../../environments/environment';
import { Variable } from '../../../../models/api/variable.model';
import { SessionStorage } from '../../../enums/storage';
import { DescriptionComponent } from '../../modals/description/description.component';
import { ImportComponent } from '../../modals/import/import.component';
import { VariableFormComponent } from '../../modals/variable-form/variable-form.component';

@Component({
  selector: 'syndicate-variable-tab',
  templateUrl: './variable-tab.component.html',
  styleUrls: ['./variable-tab.component.scss']
})
export class VariableTabComponent implements OnInit, OnDestroy {
  private timerSubscription: Subscription = null;

  public variables: Variable[] = [];
  public count: number = 0;
  public machines: any[] = [];
  public devices: any[] = [];

  constructor(
    private i18nextService: I18NextService,
    private sessionStorage: SyndicateStorageService,
    private variablesService: VariablesService,
    private dialog: MatDialog,
    private devicesService: DevicesService,
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  /**
   * Initializes the variables datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the variable sort that is applied
   *
   * @memberOf {VariableTabComponent}
   */
  init(): void {
    this.initVariable();
    this.initDevice();
    this.initMachine();
    this.subscribeRefresh();
  }

  /**
   * Get list of variables
   *
   * @memberOf {VariableTabComponent}
   */
  initVariable(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES_CONFIG);
    if (sorting) {
      if (sorting.varSelect) {
        if (sorting.varSelect.level) {
          this.fetchVariables(
            sorting.page, sorting.limit, sorting.column, sorting.sort, sorting.search, sorting.select, sorting.varSelect, '');
        } else {
          this.fetchVariables(
            sorting.page, sorting.limit, sorting.column, sorting.sort, sorting.search, sorting.select, '', sorting.varSelect);
        }
      } else {
        this.fetchVariables(sorting.page, sorting.limit, sorting.column, sorting.sort, sorting.search, sorting.select, '', '');
      }
    } else {
      this.fetchVariables(1, 25, 'createdAt', -1, '', '', '', '');
    }
  }

  /**
   * Get list of deviceId of variables
   *
   * @memberOf {VariableTabComponent}
   */
  initDevice(): void {
    this.variablesService.getDeviceId().subscribe(
      (device: any) => {
        this.devices = device.data;
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Get machineId and equipmentId from devices
   *
   * @memberOf {VariableTabComponent}
   */
  initMachine(): void {
    this.devicesService.getMachine().subscribe(
      (machine: any) => {
        this.machines = machine.data;
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Get variables with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {VariableTabComponent}
   */
  fetchVariables(
    page: number, limit: number, column: string, sort: number, search: string, deviceId: string, machineId: any, equipmentId: any): void {
    this.variablesService.getVariablesConfiguration(page, limit, sort, column, search, deviceId, machineId, equipmentId).subscribe(
      (variables: any) => {
        this.variables = [];
        for (const variable of variables.data.result) {
          if (variable.device) {
            variable.equipmentId = variable.device.equipmentId;
            variable.machineId = variable.device.machineId;
            variable.deviceId = variable.device._id;
            variable.constructionId = variable.device.constructionId;
          }
          this.variables.push(new Variable().deserialize(variable));
        }
        this.count = variables.data.count;
        const varSelect: any = machineId || equipmentId || '';
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES_CONFIG, {
          page,
          limit,
          column,
          sort,
          search,
          varSelect,
          select: deviceId
        });
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the variables datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on items
   *
   * @memberOf {VariableTabComponent}
   */
  onRefresh(event: any): void {
    if (event.select === 'all') {
      event.select = '';
    }
    if (event.varSelect) {
      if (event.varSelect.level) {
        this.fetchVariables(event.page, event.limit, event.column, event.sort, event.search, event.select, event.varSelect, '');
      } else {
        this.fetchVariables(event.page, event.limit, event.column, event.sort, event.search, event.select, '', event.varSelect);
      }
    } else {
      this.fetchVariables(event.page, event.limit, event.column, event.sort, event.search, event.select, '', '');
    }
  }

  /**
   * Start a timer to refresh the list of items each ten seconds
   *
   * @memberOf {VariableTabComponent}
   */
  subscribeRefresh(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.init());
  }

  /**
   * Open Modal to create new variable
   * Set default data
   *
   * @memberOf {VariableTabComponent}
   */
  onAdd(): void {
    this.openDeviceDialog({}, 'add');
  }

  /**
   * Open the device dialog to add or edit
   * @param data Data to display in the device Dialog
   * @param mode Add or Edit mode
   */
  openDeviceDialog(data: any, mode: string): void {
    const variableDialogRef: MatDialogRef<VariableFormComponent>  = this.dialog.open(VariableFormComponent, {
      data: { ...data, mode },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    variableDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES_CONFIG);
        this.fetchVariables(
          sorting.page,
          sorting.limit,
          sorting.sort,
          sorting.column,
          sorting.search,
          sorting.deviceId,
          sorting.machineId,
          sorting.equipmentId
        );
      }
    });
  }

  /**
   * Open Modal to edit the selected variable
   * @param event - The selected item to edit
   *
   * @memberOf {VariableTabComponent}
   */
  onEdit(event: any): void {
    this.openDeviceDialog(event, 'edit');
  }

  /**
   * Display the detail of the selected variable on a modal
   * @param event - The object relating to the selected item
   *
   * @memberOf {VariableTabComponent}
   */
  onDisplayDetail(event: any): void {
    this.dialog.open(DescriptionComponent, {
      data: {
        variable: event,
        config: true
      },
      width: '928px',
      height: 'auto',
      autoFocus: false
    });
  }

  /**
   * Open confirmation dialog to remove the selected variable
   * @param event - The selected item to remove
   *
   * @memberOf {VariableTabComponent}
   */
  onRemove(event: any): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('config.variable.delete.confirmation')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.variablesService.delete(event.row._id).subscribe(
            (variable: any) => {
              if (variable.code === 200) {
                this.initVariable();
              }
            },
            (error: any) => {
              if (error.error.code === 409) {
                this.dialog.open(InfoComponent, {
                  data: {
                    title: this.i18nextService.t('config.variable.delete.error'),
                    message: this.i18nextService.t('config.variable.delete.message')
                  },
                  width: '600px',
                  height: 'auto',
                  autoFocus: false
                });
              } else {
                console.error(error);
              }
            },
          );
        }
      },
    );
  }

  /**
   * Open confirmation dialog to export variables
   *
   * @memberOf {VariableTabComponent}
   */
  onExport(): void {
    this.variablesService.export().subscribe(
      (file: any) => {
        if (file) {
          const blob: Blob = new Blob([file], { type: 'text/csv' });
          const fileName: string = 'variables.csv';
          const objectUrl: string = URL.createObjectURL(blob);
          const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

          a.href = objectUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          URL.revokeObjectURL(objectUrl);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onImport() {
    this.dialog.open(ImportComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('config.variable.delete.confirmation')
      },
      width: '800px',
      height: 'auto',
      autoFocus: false
    })
    .afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.initVariable();
        }
      },
    );
  }

}
