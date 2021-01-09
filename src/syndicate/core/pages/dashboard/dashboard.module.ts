import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { CardsModule } from 'src/syndicate/components/cards/cards.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { ConditionsService } from 'src/syndicate/services/conditions.service';
import { ReportsService } from 'src/syndicate/services/reports.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    CardsModule,
    DashboardRoutingModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  providers: [
    AlertsService,
    ReportsService,
    VariablesService,
    ConditionsService
  ],
})
export class DashboardModule { }
