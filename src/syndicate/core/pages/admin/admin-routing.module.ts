import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardFormComponent } from './dashboard-form/dashboard-form.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { UserFormComponent } from './user-form/user-form.component';
import { ViewFormComponent } from './view-form/view-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'profile',
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: ProfileFormComponent,
      },
    ]
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: UserFormComponent,
      },
    ]
  },
  {
    path: 'view',
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: ViewFormComponent,
      },
    ]
  },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: DashboardFormComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
