import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { DataTableModule } from 'src/syndicate/components/dataTable/dataTable.module';
import { HeaderModule } from 'src/syndicate/components/header/header.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { ConditionsService } from 'src/syndicate/services/conditions.service';
import { ConditionsRoutingModule } from './conditions-routing.module';
import { ConditionsComponent } from './conditions.component';

@NgModule({
  declarations: [
    ConditionsComponent
  ],
  imports: [
    CommonModule,
    ConditionsRoutingModule,
    HeaderModule,
    DataTableModule,
    MaterialModule,
    I18NextModule.forRoot()
  ],
  providers: [ConditionsService],
})
export class ConditionsModule { }
