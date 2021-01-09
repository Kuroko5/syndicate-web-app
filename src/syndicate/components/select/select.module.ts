import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18NextModule } from 'angular-i18next';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { SelectComponent } from './select.component';

@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    I18NextModule.forRoot()
  ],
  exports: [SelectComponent],
  providers: []
})
export class SelectModule { }
