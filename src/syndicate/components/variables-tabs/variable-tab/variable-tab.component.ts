import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { LocalStorage, SessionStorage } from '../../../enums/storage';
import { DescriptionComponent } from '../../modals/description/description.component';

@Component({
  selector: 'syndicate-variable-tab',
  templateUrl: './variable-tab.component.html',
  styleUrls: ['./variable-tab.component.scss']
})
export class VariableTabComponent implements OnInit, OnDestroy {
  // Variables subscription and timer
  private variablesSubscription: Subscription;
  private variablesTimerSubscription: Subscription;

  // Variable detail subscription
  private variableDetailSubscription: Subscription;
  private variableDetailTimerSubscription: Subscription;

  private dialogRef: MatDialogRef<DescriptionComponent>;

  public variables: any[] = [];
  public variablesCount: number = 0;
  public currentVariable: any;
  public categories: string[] = [];

  constructor(
    private variablesService: VariablesService,
    private storageService: SyndicateStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.initVariables();
    this.categories = this.storageService.fetchInLocal(LocalStorage.SYNDICATE_CATEGORIES);
  }

 /**
   * Initializes the variables datatable
   * If a sort is saved in session then its applied during data recovery otherwise its the variables sort that is applied
   */
  initVariables(): void {
    const sorting: any = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES);
    if (sorting) {
      this.refreshVariables(sorting.page, sorting.limit, sorting.sort, sorting.column, sorting.select, sorting.search);
    } else {
      this.refreshVariables(1, 25, 1, 'vId', 'all', '');
    }
  }

  /**
   * Fetch the current variables
   * @param page The desired page
   * @param limit The number of data per page
   * @param sort The sorting (ASC or DESC)
   * @param column The column to applying the sorting
   * @param type The type of data
   * @param category The selected category
   */
  refreshVariables(
    page: number,
    limit: number,
    sort: number,
    column: string,
    select: string,
    search: string
  ): void {

    if (this.variablesSubscription) {
      this.variablesSubscription.unsubscribe();
    }
    this.variablesSubscription = this.variablesService.getVariables(
      page,
      limit,
      sort,
      column,
      select,
      search
    ).subscribe(
      (variables: any) => {
        if (variables) {
          this.storeSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES, page, limit, sort, column, select, search);
          this.variables = variables.data.result;
          this.variablesCount = variables.data.count;
          this.subscribeRefreshVariables();
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  /**
   * Refresh the variables datatable with the desired sort and pagination
   * @param event Contains the desired page, limit, sort and column to apply on variables
   */
  onRefreshVariables(event: any): void {
    this.variablesSubscription.unsubscribe();
    if (this.variablesTimerSubscription) {
      this.variablesTimerSubscription.unsubscribe();
    }
    this.refreshVariables(event.page, event.limit, event.sort, event.column, event.select, event.search);
  }

  /**
   * Save the sorting
   * @param key The key to store the sorting
   * @param page The current page
   * @param limit The current number of data per page
   * @param sort The sort direction
   * @param column The column to applying the sort
   * @param select The selected select
   */
  storeSorting(key: string, page: number, limit: number, sort: number, column: string, select: string, search: string): void {
    const sorting: any = {
      page,
      limit,
      sort,
      column,
      select,
      search
    };

    this.storageService.storeSorting(key, sorting);
  }

  /**
   * Get a variable by vId
   * @param variable The selected variable
   */
  displayVariableDetail(variable: any): void {
    this.variableDetailSubscription = this.variablesService.getVariableById(variable.vId).subscribe(
      (variable: any) => {
        this.currentVariable = variable;

        if (this.dialogRef && this.dialogRef.componentInstance) {
          this.dialogRef.componentInstance.data = { variable: this.currentVariable.description.data };
          this.subscribeRefreshVariableDetail();
        } else {
          this.onDisplayDetail();
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  /**
   * Start a timer when the modal if open to refresh the value of the selected variable
   */
  subscribeRefreshVariableDetail(): void {
    this.variableDetailTimerSubscription = timer(environment.timer).subscribe(() => {
      this.displayVariableDetail(this.currentVariable.description.data);
    });
  }

  /**
   * Display the detail of the selected variable on a modal
   * @param event The object relating to the selected variable
   */
  onDisplayDetail(): void {
    this.subscribeRefreshVariableDetail();

    this.dialogRef = this.dialog.open(DescriptionComponent, {
      data: {
        variable: this.currentVariable.description.data
      },
      width: '928px',
      height: 'auto',
      autoFocus: false
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.variableDetailTimerSubscription.unsubscribe();
    });
  }

  /**
   * Start a timer to refresh the list of variables each thirty seconds
   */
  public subscribeRefreshVariables(): void {
    if (this.variablesTimerSubscription) {
      this.variablesTimerSubscription.unsubscribe();
    }

    const sorting: any = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_VARIABLES);

    this.variablesTimerSubscription = timer(environment.timer).subscribe(
      () => this.refreshVariables(
        sorting.page,
        sorting.limit,
        sorting.sort,
        sorting.column,
        sorting.select,
        sorting.search
      ));
  }

  /**
   * Unsubscribe all susbcriptions
   */
  ngOnDestroy(): void {
    if (this.variablesSubscription) {
      this.variablesSubscription.unsubscribe();
    }
    if (this.variablesTimerSubscription) {
      this.variablesTimerSubscription.unsubscribe();
    }

    if (this.variableDetailSubscription) {
      this.variableDetailSubscription.unsubscribe();
    }

    if (this.variableDetailTimerSubscription) {
      this.variableDetailTimerSubscription.unsubscribe();
    }
  }

}
