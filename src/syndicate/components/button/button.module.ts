import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18NextModule } from 'angular-i18next';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { ButtonComponent } from './button.component';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    I18NextModule.forRoot()
  ],
  exports: [ButtonComponent],
  providers: []
})
export class ButtonModule { }
