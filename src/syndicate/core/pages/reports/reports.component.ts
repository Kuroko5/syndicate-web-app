import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { I18NextService } from 'angular-i18next';
import { ConfirmComponent } from 'src/syndicate/components/modals/confirm/confirm.component';
import { DescriptionComponent } from 'src/syndicate/components/modals/description/description.component';
import { ReportComponent } from 'src/syndicate/components/modals/report/report.component';
import { ListsService } from 'src/syndicate/services/lists.service';
import { ReportsService } from 'src/syndicate/services/reports.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage, SessionStorage } from '../../../enums/storage';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public pageName = '';
  public data: any;
  public count = 0;
  public deletedReportIndex = null;
  public types = [];
  public search: string = '';
  public type: string = '';
  public allTypes: any = this.sessionStorage.fetchInLocal(LocalStorage.SYNDICATE_TYPES);

  constructor(
    private i18nextService: I18NextService,
    private dialog: MatDialog,
    private reportsService: ReportsService,
    private sessionStorage: SyndicateStorageService,
    private listsService: ListsService,
  ) { }

  /**
   * Get all ReportTypes
   * Save the list of types in the local storage
   */
  private getTypes(): void {
    this.listsService.getAllTypes().subscribe(
      (types: any) => {
        this.sessionStorage.storeInLocal(LocalStorage.SYNDICATE_TYPES, types.data);
        this.allTypes = types.data;
        this.init();
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Init data
   */
  private init(): void {
    this.types = this.allTypes.map((reportType: any) => {
      return reportType.label;
    });
    const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_REPORTS);
    if (sorting) {
      this.fetchReports(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select, sorting.search);
    } else {
      this.fetchReports(1, 25, -1, 'createdAt', 'all', '');
    }
  }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.reports');

    if (!this.allTypes) {
      this.getTypes();
    } else {
      this.init();
    }
  }

  /**
   * Get reports with pagination and sorting
   * @param page The desired page
   * @param limit The number of the displayed data
   * @param sort The applied sort
   * @param column The selected column to apply the sort
   */
  fetchReports(page: number, limit: number, sort: number, column: string, type: string, search: string): void {
    this.reportsService.getReports(page, limit, sort, column, type, search).subscribe(
      (reports: any) => {
        this.data = reports.data.result;
        this.count = reports.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_REPORTS, {
          page,
          limit,
          sort,
          column,
          select: type
        });
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the reports datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, sort and column to apply on reports
   */
  onRefreshData(event: any): void {
    this.fetchReports(event.page, event.limit, event.sort, event.column, event.select, event.search);
  }

  /**
   * Open Modal to create new Report
   * Set default data
   */
  onCreateReport(): void {
    const data = {
      name: '',
      type: null,
      operator: '',
      description: ''
    };

    this.openReportDialog(data, 'create');
  }

  /**
   * Open Modal to edit the selected report
   * @param event The selected item to edit
   */
  onEditReport(event: any): void {
    this.reportsService.getReportById(event._id).subscribe(
      (report: any) => {
        this.openReportDialog(report.data, 'edit');
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Open the report dialog to create or edit
   * @param data - Data to display in the Report Dialog
   * @param mode - Create or Edit mode
   */
  openReportDialog(data: any, mode: string): void {
    const reportDialogRef = this.dialog.open(ReportComponent, {
      data: { ...data, mode },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    reportDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_REPORTS);
        this.fetchReports(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select, sorting.search);
      }
    });
  }

  /**
   * Display the detail of the selected report on a modal
   * @param event The object relating to the selected report
   */
  onDisplayDetail(event: any): void {
    this.reportsService.getReportById(event._id).subscribe(
      (report: any) => {
        this.dialog.open(DescriptionComponent, {
          data: report.data,
          width: '928px',
          height: 'auto'
        });
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Open confirmation dialog to remove the selected item
   * @param event The selected item to remove
   */
  onRemoveReport(event: any): void {
    const confirmDialog = this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18nextService.t('reports.delete.confirmation')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    });

    confirmDialog.afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.deletedReportIndex = event.index;
          this.reportsService.deleteReport(event.row._id).subscribe(
            (res: any) => {
              if (res) {
                this.deletedReportIndex = null;
                const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_REPORTS);
                this.fetchReports(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select, sorting.search);
              }
            },
            (error: any) => {
              console.error(error);
              this.deletedReportIndex = null;
            }
          );
        }
      });
  }
}
