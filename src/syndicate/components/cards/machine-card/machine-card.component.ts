import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { VariablesService } from '../../../services/variables.service';

@Component({
  selector: 'syndicate-machine-card',
  templateUrl: './machine-card.component.html',
  styleUrls: ['./machine-card.component.scss']
})
export class MachineCardComponent implements OnInit, OnDestroy {

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public machines: any[] = [];

  constructor(
    private variablesService: VariablesService,
  ) { }

  /**
   * Get the variable list for the machine
   *
   * @memberOf {MachineCardComponent}
   */
  private getMachines(): void {
    this.dataSubscription = this.variablesService.getCard(this.card._id).subscribe(
      (result: any): void => {
        if (result.code === 200) {
          this.machines = result.variables;
        }
        this.refreshMachines();
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }

  /**
   * Refresh the list of variables with a timer
   *
   * @memberOf {MachineCardComponent}
   */
  private refreshMachines(): void {
    this.timerSubscription = timer(environment.timer).subscribe(() => this.getMachines());
  }

  ngOnInit() {
    this.getMachines();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
