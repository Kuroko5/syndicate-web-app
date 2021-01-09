import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { LocalStorage, SessionStorage } from '../../enums/storage';
import { AlertComponent } from '../modals/alert/alert.component';

@Component({
  selector: 'syndicate-alerts-tabs',
  templateUrl: './alerts-tabs.component.html',
  styleUrls: ['./alerts-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertsTabsComponent implements OnInit, OnDestroy {

  // Defaults subscription and timer
  private defaultsSusbcription: Subscription;
  private defaultsTimerSubscription: Subscription;

  // Alarms subscription and timer
  private alarmsSubscription: Subscription;
  private alarmsTimerSubscription: Subscription;

  // Historical subscription and timer
  private historicalSubscription: Subscription;
  private historicalTimerSubscription: Subscription;

  @Input() tabIndex = 0;

  public index = 0;
  public defaults = [];
  public alarms = [];
  public historical = [];
  public categories = [];
  public defaultsCount = 0;
  public alarmsCount = 0;
  public historicalCount = 0;
  public defaultsTotalCount = 0;
  public alarmsTotalCount = 0;

  constructor(
    private alertsService: AlertsService,
    private dialog: MatDialog,
    private storageService: SyndicateStorageService
  ) { }

  ngOnInit() {
    this.index = this.tabIndex;
    this.categories = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_CATEGORIES);

    // Init the defaults datatable
    this.initDefaults();

    // Init the alarms datatable
    this.initAlarms();

    // Init the historical datatable
    this.initHistorical();
  }

  /**
  * Initializes the defaults datatable
  * If a sort is saved in session then its applied during data recovery otherwise its the default sort that is applied
  */
  initDefaults(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEFAULTS);
    if (sorting) {
      this.refreshDefaults(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select);
    } else {
      this.refreshDefaults(1, 25, -1, 'd', 'all');
    }
  }

  /**
   * Initializes the alarms datatable
   * If a sort is saved in session then its applied during data recovery otherwise its the alarm sort that is applied
   */
  initAlarms(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_ALARMS);
    if (sorting) {
      this.refreshAlarms(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select);
    } else {
      this.refreshAlarms(1, 25, -1, 'd', 'all');
    }
  }

  /**
   * Initializes the historical datatable
   * If a sort is saved in session then its applied during data recovery otherwise its the historical sort that is applied
   */
  initHistorical(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_HISTORICAL);
    if (sorting) {
      this.refreshHistorical(
        sorting.page,
        sorting.limit,
        sorting.sort,
        sorting.column,
        sorting.select,
        sorting.dates,
        sorting.search
      );
    } else {
      this.refreshHistorical(1, 25, -1, 'startDate', 'all', { min: '', max: '' }, '');
    }
  }

  /**
   * Fetch the current defaults
   * @param page The desired page
   * @param limit The number of data per page
   * @param sort The sorting (ASC or DESC)
   * @param column The column to applying the sorting
   * @param type The type of data
   * @param category The selected category
   */
  refreshDefaults(
    page: number,
    limit: number,
    sort: number,
    column: string,
    category: string
  ): void {
    this.defaultsSusbcription = this.alertsService.getAlerts(
      page,
      limit,
      sort,
      column,
      'default',
      category
    ).subscribe(
      (defaults: any) => {
        if (defaults) {
          this.storeSorting(SessionStorage.SYNDICATE_SORTING_DEFAULTS, page, limit, sort, column, category);
          this.defaults = defaults.data.result;
          this.defaultsCount = defaults.data.count;
          this.defaultsTotalCount = defaults.data.totalCount;
          this.subscribeRefreshDefaults();
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Fetch the current alarms
   * @param page The desired page
   * @param limit The number of data per page
   * @param sort The sorting (ASC or DESC)
   * @param column The column to applying the sorting
   * @param type The type of data
   * @param category The selected category
   */
  refreshAlarms(
    page: number,
    limit: number,
    sort: number,
    column: string,
    category: string
  ): void {
    this.alarmsSubscription = this.alertsService.getAlerts(
      page,
      limit,
      sort,
      column,
      'alert',
      category
    ).subscribe(
      (alarms: any) => {
        if (alarms) {
          this.storeSorting(SessionStorage.SYNDICATE_SORTING_ALARMS, page, limit, sort, column, category);
          this.alarms = alarms.data.result;
          this.alarmsCount = alarms.data.count;
          this.alarmsTotalCount = alarms.data.totalCount;
          this.subscribeRefreshAlarms();
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Fetch the historical
   * @param page The desired page
   * @param limit The number of data per page
   * @param sort The sorting (ASC or DESC)
   * @param column The column to applying the sorting
   * @param type The type of data
   * @param category The selected category
   */
  refreshHistorical(
    page: number,
    limit: number,
    sort: number,
    column: string,
    category: string,
    dates: any,
    search: string
  ): void {
    this.historicalSubscription = this.alertsService.getHistorical(
      page,
      limit,
      sort,
      column,
      category,
      dates,
      search
    ).subscribe(
      (historical: any) => {
        if (historical) {
          this.storeSorting(SessionStorage.SYNDICATE_SORTING_HISTORICAL, page, limit, sort, column, category, dates, search);
          this.historical = historical.data.result;
          this.historicalCount = historical.data.count;
          this.subscribeRefreshHistorical();
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Refresh the defaults datatable with the desired sort and pagination
   * @param event Contains the desired page, limit, sort and column to apply on defaults
   */
  onRefreshDefaults(event): void {
    this.defaultsSusbcription.unsubscribe();
    if (this.defaultsTimerSubscription) {
      this.defaultsTimerSubscription.unsubscribe();
    }
    this.refreshDefaults(event.page, event.limit, event.sort, event.column, event.select);
  }

  /**
   * Refresh the alarms datatable with the desired sort and pagination
   * @param event Contains the desired page, limit, sort and column to apply on alarms
   */
  onRefreshAlarms(event): void {
    this.alarmsSubscription.unsubscribe();
    if (this.alarmsTimerSubscription) {
      this.alarmsTimerSubscription.unsubscribe();
    }
    this.refreshAlarms(event.page, event.limit, event.sort, event.column, event.select);
  }

  /**
   * Refresh the historical datatable with the desired sort and pagination
   * @param event Contains the desired page, limit, sort and column to apply on historical
   */
  onRefreshHistorical(event): void {
    this.historicalSubscription.unsubscribe();
    if (this.historicalTimerSubscription) {
      this.historicalTimerSubscription.unsubscribe();
    }
    this.refreshHistorical(event.page, event.limit, event.sort, event.column, event.select, event.dates, event.search);
  }

  /**
  * Save the sorting
  * @param key The key to store the sorting
  * @param page The current page
  * @param limit The current number of data per page
  * @param sort The sort direction
  * @param column The column to applying the sort
  * @param select The selected category
  */
  storeSorting(key: string, page: number, limit: number, sort: number, column: string, select: string, dates?, search?: string): void {

    const sorting = {
      page,
      limit,
      sort,
      column,
      select,
      dates,
      search
    };

    this.storageService.storeSorting(key, sorting);
  }

  /**
   * Display the detail of the selected alert on a modal
   * @param event The object relating to the selected alert
   */
  onDisplayDetail(event): void {
    this.alertsService.getAlertById(event.vId).subscribe(
      (alert: any) => {
        if (alert) {
          if (event.endDate) {
            this.openDialog(alert.description.data, event);
          } else {
            this.openDialog(alert.description.data);
          }
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Open a Modal to display the detail
   * @param data The data's object to display
   * @param endDate The end date of the default or alarm
   */
  openDialog(data, dates?): void {
    const detail = { ...data, dates };

    this.dialog.open(AlertComponent, {
      data: detail,
      width: '928px',
      height: 'auto',
      autoFocus: false
    });
  }

  /**
   * Start a timer to refresh the list of defaults each thirty seconds
   */
  public subscribeRefreshDefaults(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_DEFAULTS);

    this.defaultsTimerSubscription = timer(environment.timer).subscribe(
      () => this.refreshDefaults(
        sorting.page,
        sorting.limit,
        sorting.sort,
        sorting.column,
        sorting.select
      ));
  }

  /**
   * Start a timer to refresh the list of alarms each thirty seconds
   */
  public subscribeRefreshAlarms(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_ALARMS);

    this.alarmsTimerSubscription = timer(environment.timer).subscribe(
      () => this.refreshAlarms(
        sorting.page,
        sorting.limit,
        sorting.sort,
        sorting.column,
        sorting.select
      ));
  }

  /**
   * Start a timer to refresh the historical each thirty seconds
   */
  public subscribeRefreshHistorical(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_HISTORICAL);

    this.historicalTimerSubscription = timer(environment.timer).subscribe(
      () => this.refreshHistorical(
        sorting.page,
        sorting.limit,
        sorting.sort,
        sorting.column,
        sorting.select,
        sorting.dates,
        sorting.search
      ));
  }

  /**
   * Unsubscribe all susbcriptions
   */
  ngOnDestroy(): void {
    if (this.defaultsSusbcription) {
      this.defaultsSusbcription.unsubscribe();
    }
    if (this.defaultsTimerSubscription) {
      this.defaultsTimerSubscription.unsubscribe();
    }

    if (this.alarmsSubscription) {
      this.alarmsSubscription.unsubscribe();
    }
    if (this.alarmsTimerSubscription) {
      this.alarmsTimerSubscription.unsubscribe();
    }

    if (this.historicalSubscription) {
      this.historicalSubscription.unsubscribe();
    }
    if (this.historicalTimerSubscription) {
      this.historicalTimerSubscription.unsubscribe();
    }
  }
}
