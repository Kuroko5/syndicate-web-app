import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DegradedModeComponent } from './degradedMode.component';

const routes: Routes = [
  {
    path: '',
    component: DegradedModeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DegradedModeRoutingModule { }
