import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { I18NextModule } from 'angular-i18next';
import { MomentModule } from 'ngx-moment';
import { MaterialModule } from 'src/syndicate/material/material.module';
import { ColorPickerModule } from '../color-picker/colorPicker.module';
import { VariablesGraphComponent } from './variables-graph.component';

@NgModule({
  declarations: [
    VariablesGraphComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ColorPickerModule,
    FormsModule,
    NgxChartsModule,
    MomentModule,
    I18NextModule.forRoot()
  ],
  exports: [VariablesGraphComponent],
  providers: [],
  entryComponents: []
})
export class VariablesGraphModule { }
