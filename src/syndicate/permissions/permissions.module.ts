import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionsDirective } from './permissions.directive';


@NgModule({
  declarations: [PermissionsDirective],
  imports: [
    CommonModule,
  ],
  exports: [PermissionsDirective]
})
export class PermissionsModule { }
