import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { ConditionsService } from '../../../services/conditions.service';
import { ConditionComponent } from '../../modals/condition/condition.component';

@Component({
  selector: 'syndicate-condition-card',
  templateUrl: './condition-card.component.html',
  styleUrls: ['./condition-card.component.scss']
})
export class ConditionCardComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;
  private detailTimerSubscription: Subscription;
  private dialogRef: MatDialogRef<ConditionComponent>;
  private condition: any = undefined;

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public conditions: any[] = [];

  constructor(
    private conditionsService: ConditionsService,
    private dialog: MatDialog,
  ) { }

  /**
   * Fetch Conditions and start a timer
   */
  private getConditions(): void {
    this.conditionsService.getConditions(10).subscribe(
      (conditions: any): void => {
        if (conditions) {
          this.conditions = conditions.data;
        }
        this.refreshConditions();
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }

  /**
   * Start a timer to refresh the list of conditions each ten seconds
   */
  private refreshConditions(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.getConditions());
  }

  /**
   * Display the detail of the selected condition
   */
  private onDisplayConditionDetail(): void {
    this.refreshConditionDetail();

    this.dialogRef = this.dialog.open(ConditionComponent, {
      data: {
        condition: this.condition
      },
      width: '597px',
      height: 'auto',
      autoFocus: false
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.condition = undefined;
      this.detailTimerSubscription.unsubscribe();
    });
  }

  /**
   * Start a timer when the modal if open to refresh the value of the selected condition
   */
  private refreshConditionDetail(): void {
    this.detailTimerSubscription = timer(environment.timer).subscribe((): void => {
      this.displayConditionDetail(this.condition);
    });
  }

  ngOnInit() {
    this.getConditions();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.detailTimerSubscription) {
      this.detailTimerSubscription.unsubscribe();
    }
  }

  /**
   * Get the condition by Id and display it on Modal
   * @param condition - The selected condition
   */
  public displayConditionDetail(condition: any): void {
    this.conditionsService.getConditionById(condition.rule).subscribe(
      (condition: any): void => {
        if (condition) {
          this.condition = condition.data;
          if (this.dialogRef && this.dialogRef.componentInstance) {
            this.dialogRef.componentInstance.data = { condition: this.condition };
            this.refreshConditionDetail();
          } else {
            this.onDisplayConditionDetail();
          }
        }
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }
}
