import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { AlertsService } from '../../../services/alerts.service';
import { AlertComponent } from '../../modals/alert/alert.component';

@Component({
  selector: 'syndicate-default-card',
  templateUrl: './default-card.component.html',
  styleUrls: ['./default-card.component.scss']
})
export class DefaultCardComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription;

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public defaultsCount: number = 0;
  public defaults: any[] = [];

  constructor(
    private alertsService: AlertsService,
    private dialog: MatDialog,
  ) { }

  /**
   * Fetch Defaults and start a timer
   */
  private getDefaults(): void {
    this.alertsService.getCurrentAlerts('defaults').subscribe(
      (defaults: any): void => {
        this.defaultsCount = defaults.data.count;
        this.defaults = defaults.data.result;
        this.refreshDefaults();
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }

  private refreshDefaults(): void {
    this.timerSubscription = timer(environment.timer).subscribe((): void => this.getDefaults());
  }

  ngOnInit() {
    this.getDefaults();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Get the default by id to display its detail
   *
   * @param defaultId The alert id
   * @memberOf {DefaultCardComponent}
   */
  displayDefaultDetail(defaultId: string): void {
    this.alertsService.getAlertById(defaultId).subscribe(
      (def: any): void => {
        if (def) {
          this.dialog.open(AlertComponent, {
            data: { ...def.description.data, dates: null },
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
