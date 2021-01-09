import { Component, OnInit } from '@angular/core';
import { I18NextService } from 'angular-i18next';

@Component({
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent implements OnInit {

  public pageName = '';

  constructor(private i18nextService: I18NextService) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.variables');
  }
}
