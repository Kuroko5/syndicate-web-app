import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18NextModule } from 'angular-i18next';
import { DndDirective } from 'src/syndicate/directives/dnd.directive';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { ImportComponent } from './import.component';

@NgModule({
  declarations: [
    ImportComponent,
    DndDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    I18NextModule.forRoot()
  ],
  exports: [ImportComponent],
  providers: []
})
export class ImportModule { }
