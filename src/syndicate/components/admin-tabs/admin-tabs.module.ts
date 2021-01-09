import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { ConditionsService } from '../../services/conditions.service';
import { ButtonModule } from '../button/button.module';
import { DataTableModule } from '../dataTable/dataTable.module';
import { AdminTabsComponent } from './admin-tabs.component';
import { DashboardAdminCardComponent } from './dashboard-tab/dashboard-admin-card/dashboard-admin-card.component';
import { DashboardTabComponent } from './dashboard-tab/dashboard-tab.component';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { UserTabComponent } from './user-tab/user-tab.component';
import { ViewTabComponent } from './view-tab/view-tab.component';

@NgModule({
  declarations: [
    AdminTabsComponent,
    ViewTabComponent,
    UserTabComponent,
    ProfileTabComponent,
    DashboardTabComponent,
    DashboardAdminCardComponent
  ],
  imports: [
    CommonModule,
    DataTableModule,
    MaterialModule,
    PermissionsModule,
    I18NextModule.forRoot(),
    ButtonModule,
    DragDropModule
  ],
  providers: [
    AlertsService,
    VariablesService,
    ConditionsService,
  ],
  exports: [AdminTabsComponent]
})
export class AdminTabsModule { }
