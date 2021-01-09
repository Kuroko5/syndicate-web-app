import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18NextService } from 'angular-i18next';

@Component({
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  @Input() pageName = '';

  public tabIndex = 0;

  constructor(
    private i18nextService: I18NextService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.alerts');

    this.route.params.subscribe((params) => {
      if (params.tabIndex) {
        this.tabIndex = params.tabIndex;
      }
    });
  }
}
