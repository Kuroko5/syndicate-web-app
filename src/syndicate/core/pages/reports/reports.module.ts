import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { I18NextModule } from 'angular-i18next';
import { DataTableModule } from 'src/syndicate/components/dataTable/dataTable.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { ReportComponent } from 'src/syndicate/components/modals/report/report.component';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { ReportsService } from 'src/syndicate/services/reports.service';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    HeaderModule,
    MaterialModule,
    DataTableModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  providers: [ReportsService],
  entryComponents: [
    ReportComponent
  ]
})
export class ReportsModule { }
