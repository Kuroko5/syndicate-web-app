import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'syndicate-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input() items = [];
  @Input() type = '';
  @Input() category: string = '';
  @Output() selectedEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Click event to want to display the item's detail
   * Emit the event and passing the item's id
   * @param itemId The item's id
   */
  onDetail(itemId: string): void {
    this.selectedEmitter.emit(itemId);
  }
}
