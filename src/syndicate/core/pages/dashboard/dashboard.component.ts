import { Component, OnInit } from '@angular/core';
import { I18NextService } from 'angular-i18next';
import { Card } from '../../../../models/api/card.model';
import { CardType } from '../../../enums/card-type.enum';
import { CardsService } from '../../../services/cards.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public pageName: string = '';
  public cards: Card[] = [];
  // reference to enum to use it in template
  public cardType: typeof CardType = CardType;

  constructor(
    private i18nextService: I18NextService,
    private cardsService: CardsService,
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.dashboard');

    this.cardsService.getAll().subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200 && res.data) {
          this.cards = res.data;
          this.cards.sort((a: Card, b: Card): number => a.position - b.position);
        }
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }
}
