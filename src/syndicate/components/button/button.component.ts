import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'syndicate-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() iconName = '';
  @Input() label = '';

  @Output() clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  /**
   * Emit the click event
   */
  onClick(): void {
    this.clickEvent.emit();
  }
}
