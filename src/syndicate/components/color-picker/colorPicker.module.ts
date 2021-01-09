import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { PipesModule } from 'src/syndicate/pipes/pipes.module';
import { APIService } from 'src/syndicate/services/api.service';
import { SyndicateStorageService } from 'src/syndicate/services/storage.service';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { SearchBarModule } from '../searchBar/searchBar.module';
import { SelectModule } from '../select/select.module';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SelectModule,
    SearchBarModule,
    DatepickerModule,
    MomentModule,
    PipesModule,
    I18NextModule.forRoot()
  ],
  exports: [
    ColorPickerComponent,
  ],
  providers: [APIService, SyndicateStorageService],
})
export class ColorPickerModule { }
