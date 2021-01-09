import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/syndicate/guards/auth.guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(mod => mod.HomeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(mod => mod.DashboardModule),
        canActivate: [AuthGuard],
        data: { permission:  ['DASHBOARD'] },
      },
      {
        path: 'alerts',
        loadChildren: () => import('../pages/alerts/alerts.module').then(mod => mod.AlertsModule),
        canActivate: [AuthGuard],
        data: { permission:  ['ALERTS'] },
      },
      {
        path: 'conditions',
        loadChildren: () => import('../pages/conditions/conditions.module').then(mod => mod.ConditionsModule),
        canActivate: [AuthGuard],
        data: { permission:  ['CONDITIONS'] },
      },
      {
        path: 'variables',
        loadChildren: () => import('../pages/variables/variables.module').then(mod => mod.VariablesModule),
        canActivate: [AuthGuard],
        data: { permission:  ['VARIABLES'] },
      },
      {
        path: 'documents',
        loadChildren: () => import('../pages/documents/documents.module').then(mod => mod.DocumentsModule),
        canActivate: [AuthGuard],
        data: { permission:  ['DOCUMENTS'] },
      },
      {
        path: 'documents/categories',
        loadChildren: () => import('../pages/documents-categories/documents-categories.module').then(mod => mod.DocumentsCategoriesModule),
        canActivate: [AuthGuard],
        data: { permission:  ['DOCUMENTS'] },
      },
      {
        path: 'reports',
        loadChildren: () => import('../pages/reports/reports.module').then(mod => mod.ReportsModule),
        canActivate: [AuthGuard],
        data: { permission:  ['REPORTS'] },
      },
      {
        path: 'degradedMode',
        loadChildren: () => import('../pages/degradedMode/degradedMode.module').then(mod => mod.DegradedModeModule),
        canActivate: [AuthGuard],
        data: { permission:  ['DEGRADED'] },
      },
      {
        path: 'admin',
        loadChildren: () => import('../pages/admin/admin.module').then(mod => mod.AdminModule),
        canActivate: [AuthGuard],
        data: { permission:  ['ADMIN'] },
      },
      {
        path: 'views',
        loadChildren: () => import('../pages/views/views.module').then(mod => mod.ViewsModule),
        canActivate: [AuthGuard],
        data: { permission:  ['VIEWS'] },
      },
      {
        path: 'hardware-architecture',
        loadChildren: () => import('../pages/hardware-architecture/hardware-architecture.module')
          .then(mod => mod.HardwareArchitectureModule),
        canActivate: [AuthGuard],
        data: { permission: ['HARDWARE'] },
      },
      {
        path: 'config',
        loadChildren: () => import('../pages/config/config.module').then(mod => mod.ConfigModule),
        canActivate: [AuthGuard],
        data: { permission: ['CONFIG'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
