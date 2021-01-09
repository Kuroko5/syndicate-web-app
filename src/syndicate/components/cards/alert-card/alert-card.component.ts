import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { AlertsService } from '../../../services/alerts.service';
import { AlertComponent } from '../../modals/alert/alert.component';

@Component({
  selector: 'syndicate-alert-card',
  templateUrl: './alert-card.component.html',
  styleUrls: ['./alert-card.component.scss']
})
export class AlertCardComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public alarmsCount: number = 0;
  public alarms: any[] = [];

  constructor(
    private alertsService: AlertsService,
    private dialog: MatDialog,
  ) { }

  /**
   * Fetch Alarms and start a timer
   */
  private getAlarms(): void {
    this.alertsService.getCurrentAlerts('alerts').subscribe(
      (alarms: any): void => {
        this.alarmsCount = alarms.data.count;
        this.alarms = alarms.data.result;
        this.refreshAlarms();
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }

  /**
   * Start a timer to refresh the list of alert each ten seconds
   */
  private refreshAlarms(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.getAlarms());
  }

  ngOnInit() {
    this.getAlarms();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Get the alert by id to display its detail
   *
   * @param alertId The alert id
   * @memberOf {AlertCardComponent}
   */
  displayAlertDetail(alertId: string): void {
    this.alertsService.getAlertById(alertId).subscribe(
      (alert: any): void => {
        if (alert) {
          this.dialog.open(AlertComponent, {
            data: { ...alert.description.data, dates: null },
            width: '928px',
            height: 'auto',
            autoFocus: false
          });
        }
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }
}
