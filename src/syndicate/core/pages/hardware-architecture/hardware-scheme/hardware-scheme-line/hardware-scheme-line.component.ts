import { Component, Input, OnInit } from '@angular/core';
import { Station } from '../../../../../../models/api/station.model';

@Component({
  selector: 'syndicate-hardware-scheme-line',
  templateUrl: './hardware-scheme-line.component.html',
  styleUrls: ['./hardware-scheme-line.component.scss']
})
export class HardwareSchemeLineComponent implements OnInit {

  @Input() public position: number = 0;
  @Input() public stations: Station[];

  constructor() { }

  ngOnInit() {
    // if there is only one station on the line, we add an empty one to create the link to the scheme
    if (this.stations.length % 4 === 1) {
      this.stations.push(null);
    }
  }

}
