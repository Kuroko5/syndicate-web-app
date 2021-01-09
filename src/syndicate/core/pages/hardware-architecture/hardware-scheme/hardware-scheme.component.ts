import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Station } from '../../../../../models/api/station.model';

@Component({
  selector: 'syndicate-hardware-scheme',
  templateUrl: './hardware-scheme.component.html',
  styleUrls: ['./hardware-scheme.component.scss']
})
export class HardwareSchemeComponent implements OnInit, OnChanges {

  @Input() public stations: Station[];

  public splittedStations: Station[][] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // split stations array into multiple array of maximum 4 stations
    if (changes.stations && changes.stations.currentValue) {
      this.stations = changes.stations.currentValue;
      this.splittedStations = [];
      const size: number = 4;
      for (let i: number = 0; i < this.stations.length; i += size) {
        this.splittedStations.push(this.stations.slice(i, i + size));
      }
    }
  }
}
