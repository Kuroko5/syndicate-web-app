import { Component, OnInit } from '@angular/core';
import { I18NextService } from 'angular-i18next';
import { Link } from 'src/models/interfaces/link';

@Component({
  selector: 'syndicate-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public permissions = JSON.parse(localStorage.getItem('user')).permissions;

  public links: Link[] = [
    {
      label: this.i18NextService.t('global.pages.name.dashboard'),
      url: '/dashboard',
      icon: 'dashboard',
      permission: 'DASHBOARD'
    },
    {
      label: this.i18NextService.t('global.pages.name.alerts'),
      url: '/alerts',
      icon: 'bell',
      permission: 'ALERTS'
    },
    {
      label: this.i18NextService.t('global.pages.name.conditions'),
      url: '/conditions',
      icon: 'list',
      permission: 'CONDITIONS'
    },
    {
      label: this.i18NextService.t('global.pages.name.variables'),
      url: '/variables',
      icon: 'diag',
      permission: 'VARIABLES'
    },
    {
      label: this.i18NextService.t('global.pages.name.documents'),
      url: '/documents/categories',
      icon: 'folder',
      permission: 'DOCUMENTS'
    },
    {
      label: this.i18NextService.t('global.pages.name.reports'),
      url: '/reports',
      icon: 'file',
      permission: 'REPORTS'
    },
    {
      label: this.i18NextService.t('global.pages.name.degraded'),
      url: '/degradedMode',
      icon: 'degraded',
      permission: 'DEGRADED'
    },
    {
      label: this.i18NextService.t('global.pages.name.views'),
      url: '/views',
      icon: 'paint',
      permission: 'VIEWS'
    },
    {
      label: this.i18NextService.t('global.pages.name.hardware_architecture'),
      url: '/hardware-architecture',
      icon: 'globe',
      permission: 'HARDWARE'
    },
  ];

  constructor(private i18NextService: I18NextService) {
  }

  /**
   * This function deletes all the links the user doesn't have access
   */
  private checkRight(): void {
    const right = [];
    this.links.forEach((link: Link): void => {
      if (this.permissions.includes(link.permission)) {
        right.push(link);
      }
    });
    this.links = right;
  }

  ngOnInit() {
    this.checkRight();
  }
}
