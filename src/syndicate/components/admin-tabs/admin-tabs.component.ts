import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { I18NextService } from 'angular-i18next';

@Component({
  selector: 'syndicate-admin-tabs',
  templateUrl: './admin-tabs.component.html',
  styleUrls: ['./admin-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminTabsComponent implements OnInit {
  public pageName: string = '';
  public previousIndex: number | null = null;

  constructor(
    private i18nextService: I18NextService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.admin');
    if (this.route.params) {
      this.route.params.subscribe((value: Params) => {
        if (value.hasOwnProperty('index')) {
          this.previousIndex = value.index;
        }
      });
    }
  }
}
