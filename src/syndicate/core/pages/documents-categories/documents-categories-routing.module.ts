import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsCategoriesComponent } from './documents-categories.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsCategoriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsCategoriesRoutingModule { }
