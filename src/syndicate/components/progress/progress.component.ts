import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'syndicate-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  constructor() {}

  ngOnInit() {}
}
