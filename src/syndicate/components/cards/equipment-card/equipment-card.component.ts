import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'syndicate-equipment-card',
  templateUrl: './equipment-card.component.html',
  styleUrls: ['./equipment-card.component.scss']
})
export class EquipmentCardComponent implements OnInit, OnDestroy {

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  @Input()
  public card: Card = null;

  public cardType: typeof CardType = CardType;
  public views: any[] = [];

  constructor(
    private usersService: UsersService,
    private router: Router,
  ) { }

  /**
   * Get the views for the user to show its defaults and alerts
   *
   * @memberOf {EquipmentCardComponent}
   */
  private getViews(): void {
    this.dataSubscription = this.usersService.getViewsCard().subscribe(
      (result: any): void => {
        if (result.code === 200) {
          this.views = result.views;
        }
        this.refreshViews();
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }

  /**
   * Refresh the views for the user with a timer
   *
   * @memberOf {EquipmentCardComponent}
   */
  private refreshViews(): void {
    this.timerSubscription = timer(environment.timer).subscribe((): void => this.getViews());
  }

  ngOnInit() {
    this.getViews();
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  /**
   * Go to the view id page
   *
   * @param viewId The view id
   * @memberOf {EquipmentCardComponent}
   */
  goToView(viewId: string): void {
    const data: any = {
      id: viewId
    };

    this.router.navigate(['/views', data]).catch((error) => {
      return new Error(error);
    });
  }
}
