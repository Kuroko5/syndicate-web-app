import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardType } from '../../../enums/card-type.enum';

@Component({
  selector: 'syndicate-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  @Input() data = [];
  @Input() type: CardType = CardType.NONE;
  @Input() category: string = '';
  @Input() column: number = 1;
  @Output() selectEmitter: EventEmitter<any> = new EventEmitter<any>();

  public cardType: typeof CardType = CardType;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Emit the selection of the item and passing the item's id
   * @param event The item's id
   */
  public onSelect(event): void {
    this.selectEmitter.emit(event);
  }
}
