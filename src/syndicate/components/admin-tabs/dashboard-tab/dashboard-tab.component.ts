import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../../../models/api/card.model';
import { CardsService } from '../../../services/cards.service';

@Component({
  selector: 'syndicate-dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.scss']
})
export class DashboardTabComponent implements OnInit, OnDestroy {

  private orderChanged: boolean = false;

  cards: Card[];

  constructor(
    private router: Router,
    private cardsService: CardsService
  ) { }

  ngOnInit() {
    this.cardsService.getAll().subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200) {
          this.cards = [];
          for (const card of res.data) {
            this.cards.push(new Card().deserialize(card));
          }
          this.cards.sort((a: Card, b: Card): number => a.position - b.position);
        } else {
          console.error(res.message);
        }
      },
      (error: any): void => {
        console.error(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.orderChanged) {
      const ids: string[] = this.cards.map((card: Card): string => card._id);
      this.cardsService.order({ cards: ids }).subscribe(
        (res: any): void => {
          if (res && res.code && res.code !== 200) {
            console.error(res.message);
          }
        },
        (error: any): void => {
          console.error(error);
        }
      );
    }
  }

  /**
   * Redirect to create new card
   */
  onAdd(): void {
    this.router.navigate(['admin', 'dashboard', 'create']);
  }

  /**
   * Delete selected card with id
   *
   * @param id - id of card to delete
   * @memberOf {DashboardTabComponent}
   */
  deleteCard(id: string): void {
    this.cardsService.delete(id).subscribe(
      (res: any): void => {
        if (res && res.code && res.code === 200) {
          const deletedCardIndex: number = this.cards.findIndex((card: Card): boolean => card._id === id);
          this.cards.splice(deletedCardIndex, 1);
        }
      },
      (error: any): void => {
        console.error(error);
      },
    );
  }

  /**
   * Move the drag item in drop position
   *
   * @param event - Drag and drop event
   * @memberOf {DashboardTabComponent}
   */
  dragDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
    this.orderChanged = true;
  }
}
