import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginatorIntl } from '@angular/material';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { ButtonModule } from 'src/syndicate/components/button/button.module';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PermissionsModule } from 'src/syndicate/permissions/permissions.module';
import { PipesModule } from 'src/syndicate/pipes/pipes.module';
import { APIService } from 'src/syndicate/services/api.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { SearchBarModule } from '../searchBar/searchBar.module';
import { SelectModule } from '../select/select.module';
import { DataTableComponent } from './dataTable.component';
import { getFrPaginatorIntl } from './fr-paginator-intl';

@NgModule({
  declarations: [
    DataTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SelectModule,
    SearchBarModule,
    DatepickerModule,
    MomentModule,
    PipesModule,
    ButtonModule,
    PermissionsModule,
    I18NextModule.forRoot()
  ],
  exports: [DataTableComponent],
  providers: [APIService, SyndicateStorageService,
    { provide: MatPaginatorIntl, useValue: getFrPaginatorIntl() },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ],
})
export class DataTableModule { }
