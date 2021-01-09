import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I18NextService } from 'angular-i18next';
import { Card } from '../../../../../models/api/card.model';
import { CardsService } from '../../../../services/cards.service';
import { ConfirmComponent } from '../../../modals/confirm/confirm.component';

@Component({
  selector: 'syndicate-dashboard-admin-card',
  templateUrl: './dashboard-admin-card.component.html',
  styleUrls: ['./dashboard-admin-card.component.scss']
})
export class DashboardAdminCardComponent implements OnInit {

  @Output() delete: EventEmitter<string>;

  @Input() card: Card;

  constructor(
    private cardsService: CardsService,
    private dialog: MatDialog,
    private router: Router,
    private i18next: I18NextService,
  ) {
    this.delete = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  /**
   * On pen icon click
   * Redirect on DashboardCardFormComponent
   */
  onEdit(): void {
    this.router.navigate(['admin', 'dashboard', 'create', { card: JSON.stringify(this.card) }]);
  }

  /**
   * On trash icon click
   * Prompt ConfirmComponent for confirmation and send info to parent with output if yes
   *
   * @memberOf {DashboardAdminCardComponent}
   */
  onDelete(): void {
    this.dialog.open(ConfirmComponent, {
      data: {
        important: true,
        message: this.i18next.t('admin.delete.dashboard_card')
      },
      width: '520px',
      height: 'auto',
      autoFocus: false
    }).afterClosed().subscribe((res: any): void => {
      if (res) {
        this.delete.emit(this.card._id);
      }
    });
  }
}
