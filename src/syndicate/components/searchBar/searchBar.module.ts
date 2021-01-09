import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18NextModule } from 'angular-i18next';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { SearchBarComponent } from './searchBar.component';

@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    I18NextModule.forRoot()
  ],
  exports: [SearchBarComponent],
  providers: []
})
export class SearchBarModule { }
