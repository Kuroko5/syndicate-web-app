import { Component, Input, OnInit } from '@angular/core';
import { Station } from '../../../../../../models/api/station.model';

@Component({
  selector: 'syndicate-hardware-scheme-node',
  templateUrl: './hardware-scheme-node.component.html',
  styleUrls: ['./hardware-scheme-node.component.scss']
})
export class HardwareSchemeNodeComponent implements OnInit {

  @Input() public station: Station;
  @Input() public position: number;
  @Input() public length: number;

  constructor() { }

  ngOnInit() {
  }

}
