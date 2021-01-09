import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { I18NextService } from 'angular-i18next';
import { Subscription, timer } from 'rxjs';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { DeviceComponent } from 'src/syndicate/components/modals/device/device.component';
import { DevicesService } from 'src/syndicate/services/devices.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { environment } from '../../../../environments/environment';
import { Device } from '../../../../models/api/device.model';
import { SessionStorage } from '../../../enums/storage';
import { DeviceFormComponent } from '../../modals/device-form/device-form.component';

@Component({
  selector: 'syndicate-device-tab',
  templateUrl: './device-tab.component.html',
  styleUrls: ['./device-tab.component.scss']
})
export class DeviceTabComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription = null;

  public devices: Device[] = [];
  public count: number = 0;
  public deletedIndex: number = null;
  constructor(
    private dialog: MatDialog,
    private i18nextService: I18NextService,
    private sessionStorage: SyndicateStorageService,
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
   * Initializes the devices datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the device sort that is applied
   *
   * @memberOf {DeviceTabComponent}
   */
  init(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEVICES);
    if (sorting) {
      this.fetchDevices(sorting.page, sorting.limit, sorting.column, sorting.sort);
    } else {
      this.fetchDevices(1, 25, 'createdAt', -1);
    }
    this.subscribeRefresh();
  }

  /**
   * Get devices with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {DeviceTabComponent}
   */
  fetchDevices(page: number, limit: number, column: string, sort: number): void {
    this.devicesService.getAll(page, limit, column, sort).subscribe(
      (devices: any) => {
        this.devices = [];
        for (const device of devices.data.result) {
          this.devices.push(new Device().deserialize(device));
        }
        this.count = devices.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_DEVICES, {
          page,
          limit,
          column,
          sort,
        });
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the devices datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on items
   *
   * @memberOf {DeviceTabComponent}
   */
  onRefresh(event: any): void {
    this.fetchDevices(event.page, event.limit, event.column, event.sort);
  }

  /**
   * Start a timer to refresh the list of items each ten seconds
   *
   * @memberOf {DeviceTabComponent}
   */
  subscribeRefresh(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.init());
  }

  /**
   * Open Modal to create new device
   * Set default data
   *
   * @memberOf {DeviceTabComponent}
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
    const deviceDialogRef = this.dialog.open(DeviceFormComponent, {
      data: { ...data, mode },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    deviceDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEVICES);
        this.fetchDevices(sorting.page, sorting.limit, sorting.sort, sorting.column);
      }
    });
  }

  /**
   * Open Modal to edit the selected device
   * @param event - The selected item to edit
   *
   * @memberOf {DeviceTabComponent}
   */
  onEdit(event: any): void {
    this.openDeviceDialog(event, 'edit');
  }

  /**
   * Display the detail of the selected device on a modal
   * @param event - The object relating to the selected item
   *
   * @memberOf {DeviceTabComponent}
   */
  onDisplayDetail(event: any): void {
    this.dialog.open(DeviceComponent, {
      data: event,
      width: '928px',
      height: 'auto',
      autoFocus: false
    });
  }


  /**
   * Open confirmation dialog to remove the selected device
   * @param event - The selected item to remove
   *
   * @memberOf {ProfileTabComponent}
   */
  onRemoveDevice(event: any): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('config.device.delete.confirmation')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    })
      .afterClosed().subscribe(
        (res: any) => {
          if (res) {
            this.deletedIndex = event.index;
            this.devicesService.deleteDevice(event.row._id).subscribe(
              (res: any) => {
                if (res) {
                  this.deletedIndex = null;
                  const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEVICES);
                  this.fetchDevices(sorting.page, sorting.limit, sorting.column, sorting.sort);
                }
              },
              (error: any) => {
                console.error(error);
                this.deletedIndex = null;
              },
            );
          }
        },
      );
  }
}
