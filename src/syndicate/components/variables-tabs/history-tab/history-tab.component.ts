import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { SessionStorage } from '../../../enums/storage';
import { VariableComponent } from '../../modals/variable/variable.component';

@Component({
  selector: 'syndicate-history-tab',
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.scss']
})
export class HistoryTabComponent implements OnInit, OnDestroy {
  private variableSubject: Subject<any> = new Subject<any>();
  // Variable graph subscription
  private variablesGraphSubscription: Subscription;
  private variablesGraphTimerSubscription: Subscription;
  private variableSubscription: Subscription;

  public selectedVariables: any[] = [];
  public graphData: any[] = [];
  public currentDates: any = {
    min: '',
    max: ''
  };

  constructor(
    private variablesService: VariablesService,
    private storageService: SyndicateStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    const dates: any = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES_DATES);
    if (dates) {
      this.currentDates.min = dates.min;
      this.currentDates.max = dates.max;
    } else {
      this.currentDates.min = moment().subtract(1, 'hour').format();
      this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES_DATES, this.currentDates);
    }

    this.selectedVariables = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES);
    if (this.selectedVariables && this.selectedVariables.length > 0) {
      this.initGraph(this.selectedVariables, this.currentDates);
    }
    this.variableSubscription = this.variableSubject
    .pipe(
      debounceTime(1500)
    )
    .subscribe((event: any) => {
      if (event.length === 0) {
        this.graphData = [];
        if (this.variablesGraphTimerSubscription) {
          this.variablesGraphTimerSubscription.unsubscribe();
        }
      }
      this.selectedVariables = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES);
      this.initGraph(this.selectedVariables, this.currentDates);
    });
  }

  /**
   * Initialize the variables graph
   * If somes variables are stored in session by the user
   */
  initGraph(variables: any[], dates: any): void {
    if (this.variablesGraphSubscription) {
      this.variablesGraphSubscription.unsubscribe();
    }

    this.variablesGraphSubscription = this.variablesService.getVariablesHistorical(variables, dates).subscribe(
      (historical: any) => {
        if (historical) {
          historical.getRequiredVariables.data.map((data: any) => {
            data.series.map((series: any) => {
              series.name = new Date(moment.utc(series.name).local().format());
            });
          });

          this.graphData = historical.getRequiredVariables.data;
          this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES_DATES, dates);

          if (this.checkLastDate(this.graphData, dates.max) || dates.max.length === 0) {
            this.subscribeRefreshGraph(variables, dates);
          } else {
            if (this.variablesGraphTimerSubscription) {
              this.variablesGraphTimerSubscription.unsubscribe();
            }
          }
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  /**
   * Check dates to launch the refresh of the graph or not
   * @param variables The list of variables displayed on the graph
   * @param dateMax The value of the selected date max
   */
  public checkLastDate(variables: any[], dateMax: string): boolean {
    let refresh: boolean = false;

    if (!dateMax) {
      refresh = true;
      return refresh;
    }

    variables.forEach((variable: any) => {
      if (this.compareDates(variable.series[variable.series.length - 1].name, dateMax)) {
        refresh = true;
      }
    });

    return refresh;
  }

  /**
   * Compare two dates
   * @param a The variable date
   * @param b The max Date selected
   */
  public compareDates(a: string, b: string): boolean {

    const dateMin: string = moment.utc(a).local().format();

    const variableDate: number = moment(dateMin).unix();
    const maxDate: number = moment(b).unix();

    return variableDate < maxDate;
  }

  /**
   * Start a timer to refresh the list of defaults each thirty seconds
   * @param variables The variables list
   * @param dates The date min and max
   */
  public subscribeRefreshGraph(variables: any[], dates: any): void {
    if (this.variablesGraphTimerSubscription) {
      this.variablesGraphTimerSubscription.unsubscribe();
    }
    this.variablesGraphTimerSubscription = timer(environment.timer).subscribe(
      () => this.initGraph(
        variables,
        dates
      ));
  }

  /**
   * Receive the selected date(s)
   * @param event date range
   */
  onSelectDate(event: any): void {
    this.currentDates.min = event.min;
    this.currentDates.max = event.max;

    if (this.selectedVariables && this.selectedVariables.length > 0) {
      if (this.variablesGraphSubscription) {
        this.variablesGraphSubscription.unsubscribe();
      }
      this.initGraph(this.selectedVariables, this.currentDates);
    } else {
      this.storageService.storeSorting(SessionStorage.SYNDICATE_VARIABLES_DATES, this.currentDates);
    }
  }

  /**
   * Function to fetch the list of variables per category
   * and display the modal to select variables
   */
  addVariables(): void {
    this.dialog.open(VariableComponent, {
      data: null,
      width: '928px',
      height: '560px',
      autoFocus: false
    }).afterClosed().subscribe((result: any[]) => {
      if (result) {
        result.map((data: any) => {
          data.series.map((series: any) => {
            series.name = new Date(moment.utc(series.name).local().format());
          });
        });
        this.graphData = result;
        this.selectedVariables = this.storageService.fetchSorting(SessionStorage.SYNDICATE_VARIABLES);
        if (this.variablesGraphSubscription) {
          this.variablesGraphSubscription.unsubscribe();
        }
        this.initGraph(this.selectedVariables, this.currentDates);
      }
    });
  }

  /**
   * Check list to manage de timer of refreshing data
   * @param event the event
   */
  checkVariablesList(event: any): void {
    this.variableSubject.next(event);
  }

  /**
   * Unsubscribe all susbcriptions
   */
  ngOnDestroy(): void {
    if (this.variablesGraphSubscription) {
      this.variablesGraphSubscription.unsubscribe();
    }
    if (this.variablesGraphTimerSubscription) {
      this.variablesGraphTimerSubscription.unsubscribe();
    }
    if (this.variableSubscription) {
      this.variableSubscription.unsubscribe();
    }
  }

}
