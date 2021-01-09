import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { I18NextService } from 'angular-i18next';

@Component({
  selector: 'syndicate-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigTabsComponent implements OnInit {
  public previousIndex: number | null = null;

  constructor(
    private i18nextService: I18NextService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.route.params) {
      this.route.params.subscribe((value: Params) => {
        if (value.hasOwnProperty('index')) {
          this.previousIndex = value.index;
        }
      });
    }
  }

}
