import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NameFormatPipe } from './name-format.pipe';

@NgModule({
  declarations: [
    NameFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    NameFormatPipe
  ]
})
export class PipesModule { }
