import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertComponent } from 'src/syndicate/components/modals/alert/alert.component';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { ConditionsService } from 'src/syndicate/services/conditions.service';
import { VariablesService } from 'src/syndicate/services/variables.service';

@Component({
  selector: 'syndicate-views-card',
  templateUrl: './views-card.component.html',
  styleUrls: ['./views-card.component.scss']
})
export class ViewsCardComponent implements OnInit, OnDestroy {
  // Defaults Subscription and timer
  private defaultsSusbcription: Subscription = new Subscription();
  private defaultsTimerSubscription: Subscription = new Subscription();

  // Alerts Subscription and timer
  private alertsSusbcription: Subscription = new Subscription();
  private alertsTimerSubscription: Subscription = new Subscription();

  // Variables machines Subscription and timer
  private machinesSusbcription: Subscription = new Subscription();
  private machinesTimerSusbcription: Subscription = new Subscription();

  // Conditions Subscription and timer
  private conditionsSusbcription: Subscription = new Subscription();
  private conditionsTimerSusbcription: Subscription = new Subscription();

  public defaults: any[] = [];
  public alerts: any[] = [];
  public machines: any[] = [];
  public conditions: any[] = [];
  public countDefaults: number[] = [];
  public countAlerts: number[] = [];

  @Input() data: any;

  constructor(
    private alertsService: AlertsService,
    private variablesService: VariablesService,
    private dialog: MatDialog,
    private conditionsService: ConditionsService,
  ) { }

  /**
   * Compare the position fields to order an array of objects
   *
   * @param a - object to compare
   * @param b - object to compare
   */
  private compare(a: { position: number; }, b: { position: number; }): number {
    return a.position - b.position;
  }

  /**
   * Sort array of objects based on a array of ordered string
   *
   * @param a - array of objects
   * @param order - ordered array
   * @param key - index to sort
   */
  private mapOrder(a: any[], order: string[], key: string): any[] {
    const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
    return a.sort((a, b) => map[a[key]] - map[b[key]]);
  }

  ngOnInit() {
    this.initCards(this.data.cards);
  }

  /**
   * Init the cards
   *
   * @param cards - object of cards
   */
  initCards(cards: any[]): void {
    // Sort cards by position
    cards.sort(this.compare);
    for (const card of cards) {
      const variables: string[] = [];
      // Sort variables by position
      card.variables.sort(this.compare);
      card.variables.map((item: any) => {
        variables.push(item._id);
      });
      switch (card.type) {
        case 'alert':
          this.refreshAlerts(card.label, variables);
          break;
        case 'default':
          this.refreshDefaults(card.label, variables);
          break;
        case 'machine':
          this.refreshMachines(card.label, variables);
          break;
        case 'condition':
          this.refreshConditions(card.label, variables);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Fetch Defaults and start a timer
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  refreshDefaults(label: string, variables: string[]): void {
    this.defaultsSusbcription.add(
      this.alertsService.getSelectedAlerts('default', variables).subscribe(
        (defaults: any) => {
          this.countDefaults[label] = defaults.data.count;
          this.defaults[label] = this.mapOrder(defaults.data.result, variables, '_id');

          this.subscribeRefreshDefaults(label, variables);
        },
        (error: any) => {
          console.error(error);
        }
      )
    );
  }

  /**
   * Fetch Alerts and start a timer
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  refreshAlerts(label: string, variables: string[]): void {
    this.alertsSusbcription.add(
      this.alertsService.getSelectedAlerts('alert', variables).subscribe(
        (alerts: any) => {
          this.countAlerts[label] = alerts.data.count;
          this.alerts[label] = this.mapOrder(alerts.data.result, variables, '_id');

          this.subscribeRefreshAlerts(label, variables);
        },
        (error: any) => {
          console.error(error);
        }
      )
    );
  }

  /**
   * Fetch Variables machines and start a timer
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  refreshMachines(label: string, variables: string[]): void {
    this.machinesSusbcription.add(
      this.variablesService.getSelectedVariables(variables).subscribe(
        (machines: any) => {
          this.machines[label] = this.mapOrder(machines.data, variables, 'vId');

          this.subscribeRefreshMachines(label, variables);
        },
        (error: any) => {
          console.error(error);
        }
      )
    );
  }

  /**
   * Fetch Conditions and start a timer
   */
  refreshConditions(label: string, variables: string[]): void {
    this.conditionsSusbcription.add(
      this.conditionsService.getSelectedConditions(variables).subscribe(
        (res: any) => {
          this.conditions[label] = this.mapOrder(res.data, variables, '_id');

          this.subscribeRefreshConditions(label, variables);
        },
        (error: any) => {
          console.error(error);
        }
      )
    );
  }

  /**
   * Start a timer to refresh the list of defaults each ten seconds
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  subscribeRefreshDefaults(label: string, variables: any[]): void {
    this.defaultsTimerSubscription.add(timer(environment.timer).subscribe(() => this.refreshDefaults(label, variables)));
  }

  /**
   * Start a timer to refresh the list of alerts each ten seconds
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  subscribeRefreshAlerts(label: string, variables: any[]): void {
    this.alertsTimerSubscription.add(timer(environment.timer).subscribe(() => this.refreshAlerts(label, variables)));
  }

  /**
   * Start a timer to refresh the list of variables machines each ten second
   *
   * @param label - label of the card
   * @param variables - array of variables
   */
  subscribeRefreshMachines(label: string, variables: any[]): void {
    this.machinesTimerSusbcription.add(timer(environment.timer).subscribe(() => this.refreshMachines(label, variables)));
  }

  /**
   * Start a timer to refresh the list of conditions each ten seconds
   */
  subscribeRefreshConditions(label: string, variables: any[]): void {
    this.conditionsTimerSusbcription.add(timer(environment.timer).subscribe(() => this.refreshConditions(label, variables)));
  }

  /**
   * Get an alert by id and open Modal
   *
   * @param id - the data id
   * @param type - the data type
   */
  onSelect(id: string, type: string): void {
    this.displayAlertDetail(id, type);
  }

  /**
   * Get the alert by id to display its detail
   *
   * @param alertId - the alert id
   * @param component - the component used to display the detail
   * @param type - the type of the alert
   */
  displayAlertDetail(alertId: string, type: string): void {
    this.alertsService.getAlertById(alertId).subscribe(
      (alert: any) => {
        if (alert) {
          this.openDialog(AlertComponent, type, alert.description.data);
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  /**
   * Open Modal to display detail
   *
   * @param component - the component used to display the item's detail
   * @param type - type of data
   * @param data - data to display
   */
  openDialog(component: any, type: string, item: any): void {
    if (type === 'default' || type === 'alert') {
      this.dialog.open(component, {
        data: { ...item, dates: null },
        width: '928px',
        height: 'auto',
        autoFocus: false
      });
    }
  }

  /**
   * Unsubscribe all Susbcriptions
   */
  ngOnDestroy(): void {
    if (this.defaultsSusbcription) {
      this.defaultsSusbcription.unsubscribe();
    }
    if (this.defaultsTimerSubscription) {
      this.defaultsTimerSubscription.unsubscribe();
    }

    if (this.alertsSusbcription) {
      this.alertsSusbcription.unsubscribe();
    }
    if (this.alertsTimerSubscription) {
      this.alertsTimerSubscription.unsubscribe();
    }

    if (this.machinesSusbcription) {
      this.machinesSusbcription.unsubscribe();
    }
    if (this.machinesTimerSusbcription) {
      this.machinesTimerSusbcription.unsubscribe();
    }

    if (this.conditionsSusbcription) {
      this.conditionsSusbcription.unsubscribe();
    }
    if (this.conditionsTimerSusbcription) {
      this.conditionsTimerSusbcription.unsubscribe();
    }
  }

}
