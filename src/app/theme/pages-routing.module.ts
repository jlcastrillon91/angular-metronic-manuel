// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';
// Auth
import { AuthGuard } from '../core/auth';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'ecommerce',
        loadChildren:
          'app/views/pages/apps/e-commerce/e-commerce.module#ECommerceModule'
      },
      {
        path: 'ngbootstrap',
        loadChildren:
          'app/views/pages/ngbootstrap/ngbootstrap.module#NgbootstrapModule'
      },
      {
        path: 'material',
        loadChildren: 'app/views/pages/material/material.module#MaterialModule'
      },
      {
        path: 'user-management',
        loadChildren:
          'app/views/pages/user-management/user-management.module#UserManagementModule'
      },
      {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
          type: 'error-v6',
          code: 403,
          title: '403... Access forbidden',
          desc:
            "Looks like you don't have permission to access for requested page.<br> Please, contact administrator"
        }
      },
      { path: 'error/:type', component: ErrorPageComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
