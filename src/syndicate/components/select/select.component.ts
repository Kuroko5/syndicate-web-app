import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'syndicate-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {

  public selected: any;

  @Input() label = '';
  @Input() selectType = '';
  @Input() set defaultselect(select) {
    this.selected = select;
  }

  @Input() options = [];

  @Output() selectedValue = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   *
   * @param event Event of the selection change
   */
  onChange(event) {
    this.selectedValue.emit(event.value);
  }

  /**
   * Use to set default value of select
   * Handles value as a object
   * @param o1 - value from an option
   * @param o2 - value from the selection
   */
  compareObjects(o1: any, o2: any): boolean {
    if (typeof o2 === 'object') {
      return o1._id === o2._id;
    }
    return o1 === o2;
  }
}
