import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'syndicate-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageName = '';

  constructor() { }

  ngOnInit() {
  }
}
