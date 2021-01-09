import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'syndicate-searchbar',
  templateUrl: './searchBar.component.html',
  styleUrls: ['./searchBar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input() input = '';

  @Output() output: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Send input value
   */
  public send(): void {
    this.output.emit(this.input.trim());
  }
}
