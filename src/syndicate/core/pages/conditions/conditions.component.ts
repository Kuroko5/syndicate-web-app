import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { I18NextService } from 'angular-i18next';
import { Subscription, timer } from 'rxjs';
import { ConditionComponent } from 'src/syndicate/components/modals/condition/condition.component';
import { ConditionsService } from 'src/syndicate/services/conditions.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { SessionStorage } from '../../../enums/storage';

import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent implements OnInit, OnDestroy {

  // Conditions Subscription and timer
  private conditionsSusbcription: Subscription;
  private conditionsTimerSusbcription: Subscription;

  // Condition detail Subscription and timer
  private conditionDetailSubscription: Subscription;
  private conditionDetailTimerSubscription: Subscription;

  private dialogRef: MatDialogRef<ConditionComponent>;

  public pageName = '';
  public conditions = [];
  public condition: any;

  constructor(
    private i18nextService: I18NextService,
    private conditionsService: ConditionsService,
    private storageService: SyndicateStorageService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.conditions');
    this.initConditions();
  }

  /**
   * Initializes the conditions datatable
   * If a sort is saved in session then its applied during data recovery otherwise its the conditions sort that is applied
   */
  initConditions(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_CONDITIONS);
    if (sorting) {
      this.refreshConditions(sorting.sort, sorting.column);
    } else {
      this.refreshConditions(1, 'descr');
    }
  }

  /**
   * Fetch the current conditions
   * @param sort The sorting (ASC or DESC)
   * @param column The column to applying the sorting
   */
  public refreshConditions(sort, column): void {
    this.conditionsSusbcription = this.conditionsService.getConditions(null, sort, column).subscribe((conditions) => {
      if (conditions) {
        this.conditions = conditions.data;
        this.storeSorting(SessionStorage.SYNDICATE_SORTING_CONDITIONS, sort, column);
        this.subscribeRefreshConditions();
      }
    },                                                                                               (error) => {
      console.log(error);
    });
  }

  /**
   * Save the sorting
   * @param key The key to store the sorting
   * @param sort The sort direction
   * @param column The column to applying the sort
   */
  storeSorting(key: string, sort: number, column: string): void {
    const sorting = { sort, column, };
    this.storageService.storeSorting(key, sorting);
  }

  /**
   * Start a timer to refresh the list of conditions each ten seconds
   */
  public subscribeRefreshConditions(): void {
    const sorting = this.storageService.fetchSorting(SessionStorage.SYNDICATE_SORTING_CONDITIONS);

    this.conditionsTimerSusbcription = timer(environment.timer).subscribe(
      () => this.refreshConditions(sorting.sort, sorting.column)
    );
  }

  /**
   * Start a timer when the modal if open to refresh the value of the selected condition
   */
  public subscribeRefreshConditionDetail(): void {
    this.conditionDetailTimerSubscription = timer(environment.timer).subscribe(() => {
      this.onDisplayDetail(this.condition);
    });
  }

  /**
   * Refresh the conditions datatable with the desired sort
   * @param event Contains the desired sort and column to apply on conditions
   */
  onRefreshConditions(event): void {
    this.conditionsSusbcription.unsubscribe();
    if (this.conditionsTimerSusbcription) {
      this.conditionsTimerSusbcription.unsubscribe();
    }
    this.refreshConditions(event.sort, event.column);
  }

  /**
   * @param condition The condition to display
   */
  onDisplayDetail(condition): void {
    this.conditionDetailSubscription = this.conditionsService.getConditionById(condition.rule).subscribe((condition) => {
      if (condition) {
        this.condition = condition.data;
        console.log(this.condition);

        if (this.dialogRef && this.dialogRef.componentInstance) {
          this.dialogRef.componentInstance.data = { condition: this.condition };
          this.subscribeRefreshConditionDetail();
        } else {
          this.openDialog();
        }
      }
    },                                                                                                   (error) => {
      console.log(error);
    });
  }

  /**
   * Open a Modal to display the detail
   * @param data The data's object to display
   */
  openDialog(): void {
    this.subscribeRefreshConditionDetail();

    this.dialogRef = this.dialog.open(ConditionComponent, {
      data: { condition: this.condition },
      width: '597px',
      height: 'auto',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.condition = undefined;
      this.conditionDetailSubscription.unsubscribe();
      this.conditionDetailTimerSubscription.unsubscribe();
    });
  }

  /**
   * Unsubscribe the Susbcription timer and conditions
   */
  ngOnDestroy(): void {
    if (this.conditionsSusbcription) {
      this.conditionsSusbcription.unsubscribe();
    }
    if (this.conditionsTimerSusbcription) {
      this.conditionsTimerSusbcription.unsubscribe();
    }

    if (this.conditionDetailSubscription) {
      this.conditionDetailSubscription.unsubscribe();
    }
    if (this.conditionDetailTimerSubscription) {
      this.conditionDetailTimerSubscription.unsubscribe();
    }
  }
}
