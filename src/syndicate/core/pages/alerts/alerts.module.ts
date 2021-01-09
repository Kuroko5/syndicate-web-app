import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { AlertsTabsModule } from 'src/syndicate/components/alerts-tabs/alerts-tabs.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts.component';

@NgModule({
  declarations: [
    AlertsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AlertsRoutingModule,
    MaterialModule,
    AlertsTabsModule,
    I18NextModule.forRoot()
  ],
  providers: [],
})
export class AlertsModule { }
