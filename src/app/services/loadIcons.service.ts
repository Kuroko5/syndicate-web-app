import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class IconsService {

  private icons = [
    'logo',
    'check',
    'error',
    'warning',
    'logout',
    'close',
    'clock',
    'search',
    'calendar',
    'eye',
    'edit',
    'trash',
    'running',
    'info',
    'dropsort',
    'hide',
    'add',
    'settings',
    'user',
    'triangle',
    'user_circle',
    'view',
    'more',
    'check-green',
    'back',
    'back_arrow',
    'globe',
    'done',
    'horizontal_rule',
    'more_vertical',
    'ping',
    'profile',
    'folder',
    'dashboard',
    'diag',
    'bell',
    'degraded',
    'file',
    'small_bell',
    'list',
    'gauge',
    'history',
    'graphsVar',
    'defect',
    'paint',
    'order',
    'arrow-up',
    'arrow-down',
    'dragdrop',
    'config',
    'plugin',
    'variable',
    'counter',
    'export'
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {
  }

  /**
   * Recording custom icons to using with matIcon
   */
  loadIcons() {
    for (const icon of this.icons) {
      this.matIconRegistry.addSvgIcon(
        `${icon}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
      );
    }
  }
}
