/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './guard/auth.guard';
import { LeaveGuard } from './leaved/leaved.guard';

import { P404Component } from './pages/error/404.component';
import { P500Component } from './pages/error/500.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SetupAuthGuard } from './setupGuard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    },
    canActivate: [SetupAuthGuard]
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then(m => m.ForgotModule),
  },
  {
    path: 'setup',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'order-detail',
        loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'analytics',
        loadChildren: () => import('./pages/analytics/analytics.module').then(m => m.AnalyticsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'products-details',
        loadChildren: () => import('./pages/products-details/products-details.module').then(m => m.ProductsDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reviews',
        loadChildren: () => import('./pages/reviews/reviews.module').then(m => m.ReviewsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'support',
        loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule),
        canActivate: [AuthGuard],
        canDeactivate: [LeaveGuard]
      },
      {
        path: 'stats',
        loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
