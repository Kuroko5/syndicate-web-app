import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'syndicate-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() heading: string;
  @Input() color: string;
  @Output() event: EventEmitter<any> = new EventEmitter();
  public show: boolean = false;
  public defaultColors: string[] = [
    '#004289',
    '#364FC7',
    '#22B8CF',
    '#4DABF7',
    '#99E9F2',
    '#087F5B',
    '#3BCF33',
    '#94D82D',
    '#63E6BE',
    '#0b7285',
    '#862E9C',
    '#5F3DC4',
    '#B533CF',
    '#CC5DE8',
    '#845EF7',
    '#A61E4D',
    '#C41037',
    '#FA5252',
    '#F06595',
    '#FFA8A8',
    '#D9480F',
    '#FF922B',
    '#CFB133',
    '#FFD43B',
    '#FFC078',
    '#ffffff',
    '#000000'
  ];

  constructor() { }

  /**
   * Change status of visibility to color picker
   */
  public toggleColors():void {
    this.show = !this.show;
  }

  /**
   * Change color from default colors
   * @param color color hexa in string
   */
  public changeColor(color: string):void {
    this.color = color;
    this.event.emit(this.color); // Return color
    this.show = false;
  }

}
