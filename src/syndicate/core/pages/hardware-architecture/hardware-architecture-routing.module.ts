import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HardwareArchitectureFormComponent } from './hardware-architecture-form/hardware-architecture-form.component';
import { HardwareArchitectureComponent } from './hardware-architecture.component';

const routes: Routes = [
  {
    path: '',
    component: HardwareArchitectureComponent,
  },
  {
    path: 'create',
    component: HardwareArchitectureFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HardwareArchitectureRoutingModule { }
