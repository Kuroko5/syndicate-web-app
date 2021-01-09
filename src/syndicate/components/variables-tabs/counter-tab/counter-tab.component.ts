import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { CountersService } from 'src/syndicate/services/counters.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { environment } from '../../../../environments/environment';
import { Counter } from '../../../../models/api/counter.model';
import { SessionStorage } from '../../../enums/storage';

@Component({
  selector: 'syndicate-counter-tab',
  templateUrl: './counter-tab.component.html',
  styleUrls: ['./counter-tab.component.scss']
})
export class CounterTabComponent implements OnInit, OnDestroy {
  private timerSubscription: Subscription = null;

  public counters: Counter[] = [];
  public count: number = 0;
  public deletedIndex: number = null;

  constructor(
    private sessionStorage: SyndicateStorageService,
    private countersService: CountersService,
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
    const sorting: any = this.sessionStorage.fetchSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS);
    if (sorting) {
      this.fetchcounters(sorting.page, sorting.limit, sorting.column, sorting.sort, sorting.search);
    } else {
      this.fetchcounters(1, 25, 'label', 1, '');
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
  fetchcounters(page: number, limit: number, column: string, sort: number, search: string): void {
    this.countersService.getAll(page, limit, column, sort, search).subscribe(
      (counters: any) => {
        this.counters = [];
        for (const counter of counters.data.result) {
          this.counters.push(new Counter().deserialize(counter));
        }
        this.count = counters.data.count;
        this.sessionStorage.storeSorting(SessionStorage.SYNDICATE_SORTING_COUNTERS, {
          page,
          limit,
          column,
          sort,
          search
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
    this.fetchcounters(event.page, event.limit, event.column, event.sort, event.search);
  }

  /**
   * Start a timer to refresh the list of items each ten seconds
   *
   * @memberOf {CounterTabComponent}
   */
  subscribeRefresh(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.init());
  }
}
