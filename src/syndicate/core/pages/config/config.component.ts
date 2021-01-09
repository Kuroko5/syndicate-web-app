import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18NextService } from 'angular-i18next';

@Component({
  selector: 'syndicate-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  @Input() pageName: string = '';

  public tabIndex: number = 0;

  constructor(
    private i18nextService: I18NextService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.pageName = this.i18nextService.t('global.pages.name.config');

    this.route.params.subscribe((params: any) => {
      if (params.tabIndex) {
        this.tabIndex = params.tabIndex;
      }
    });
  }

}
