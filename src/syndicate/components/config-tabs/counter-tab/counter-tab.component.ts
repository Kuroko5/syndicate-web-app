import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription, timer } from 'rxjs';
import { CountersService } from 'src/syndicate/services/counters.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { environment } from '../../../../environments/environment';
import { Counter } from '../../../../models/api/counter.model';
import { SessionStorage } from '../../../enums/storage';
import { CounterFormComponent } from '../../modals/counter-form/counter-form.component';

@Component({
  selector: 'syndicate-counter-tab',
  templateUrl: './counter-tab.component.html',
  styleUrls: ['./counter-tab.component.scss']
})
export class CounterTabComponent implements OnInit, OnDestroy {
  private timerSubscription: Subscription = null;

  public counters: Counter[] = [];
  public count: number = 0;

  constructor(
    private sessionStorage: SyndicateStorageService,
    private countersService: CountersService,
    private dialog: MatDialog
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
   * Initializes the counters datatable
   * If a sort is saved in session then
   * its applied during data recovery otherwise
   * its the device sort that is applied
   *
   * @memberOf {CounterTabComponent}
   */
  init(): void {
    this.initCounter();
    this.subscribeRefresh();
  }

  /**
   * Get list of counters
   *
   * @memberOf {CounterTabComponent}
   */
  initCounter(): void {
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS_CONFIG);
    if (sorting) {
      this.fetchcounters(sorting.page, sorting.limit, sorting.column, sorting.sort);
    } else {
      this.fetchcounters(1, 25, 'label', 1);
    }
  }


  /**
   * Get counters with pagination and sorting
   * @param page - The desired page
   * @param limit - The number of the displayed data
   * @param column - The selected column to apply the sort
   * @param sort - The applied sort
   *
   * @memberOf {CounterTabComponent}
   */
  fetchcounters(page: number, limit: number, column: string, sort: number): void {
    this.countersService.getAll(page, limit, column, sort, '').subscribe(
      (counters: any) => {
        this.counters = [];
        for (const counter of counters.data.result) {
          this.counters.push(new Counter().deserialize(counter));
        }
        this.count = counters.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS_CONFIG, {
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
   * Refresh the counters datatable with the desired sort and pagination
   * @param event - Contains the desired page, limit, column and sort and to apply on items
   *
   * @memberOf {CounterTabComponent}
   */
  onRefresh(event: any): void {
    this.fetchcounters(event.page, event.limit, event.column, event.sort);
  }

  /**
   * Start a timer to refresh the list of items each ten seconds
   *
   * @memberOf {CounterTabComponent}
   */
  subscribeRefresh(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.init());
  }

  /**
   * Reset the value of the counter
   * @param event - The object relating to the selected item
   *
   * @memberOf {CounterTabComponent}
   */
  onReset(event: any): void {
    console.log('Reset');
  }

  /**
   * Open Modal to create new counter
   * Set default data
   *
   * @memberOf {CounterTabComponent}
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
    const counterDialogRef = this.dialog.open(CounterFormComponent, {
      data: { ...data, mode },
      width: '928px',
      height: 'auto',
      autoFocus: false,
    });

    counterDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const sorting = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS_CONFIG);
        this.fetchcounters(
          sorting.page,
          sorting.limit,
          sorting.column,
          sorting.sort
        );
      }
    });
  }

  /**
   * Open Modal to edit the selected counter
   * @param event - The selected item to edit
   *
   * @memberOf {CounterTabComponent}
   */
  onEdit(event: any): void {
    this.openDeviceDialog(event, 'edit');
  }

  /**
   * Open confirmation dialog to remove the selected counter
   * @param event - The selected item to remove
   *
   * @memberOf {CounterTabComponent}
   */
  onRemove(event: any): void {
    console.log('Remove');
  }
}
