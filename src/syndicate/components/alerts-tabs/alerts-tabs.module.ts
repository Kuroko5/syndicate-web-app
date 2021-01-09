import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { AlertsService } from 'src/syndicate/services/alerts.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { VariablesService } from 'src/syndicate/services/variables.service';
import { DataTableModule } from '../dataTable/dataTable.module';
import { AlertsTabsComponent } from './alerts-tabs.component';

@NgModule({
  declarations: [
    AlertsTabsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DataTableModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  exports: [AlertsTabsComponent],
  providers: [AlertsService, SyndicateStorageService, VariablesService]
})
export class AlertsTabsModule { }
