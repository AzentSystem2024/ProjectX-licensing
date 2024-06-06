import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from 'src/services/auth-guard.service'

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { LicenseReportComponent } from './views/report/license-report/license-report.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full'
  },
  {
    path: '',
    
  
  children: [
    {
      path: 'pages',
      loadChildren: () =>
      import('./views/pages/pages.module').then((m) => m.PagesModule)

    },
  ]
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
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuardService] 
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./views/master/base.module').then((m) => m.BaseModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('./views/activity/buttons.module').then((m) => m.ButtonsModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => m.UserModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./views/report/report.module').then((m) => m.ReportModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule),
          canActivate: [AuthGuardService]
      },
      {
        path: 'report/licensereport',
        component: LicenseReportComponent,
        data: {
          title: 'License Report'
        }
      },
    ]
  },
  // {
  //   path: 'licensereport',
  //   component: LicenseReportComponent,
  //   data: {
  //     title: 'License Report'
  //   }
  // },
  // {
  //   path: '404',
  //   component: Page404Component,
  //   data: {
  //     title: 'Page 404'
  //   }
  // },
  // {
  //   path: '500',
  //   component: Page500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  //   data: {
  //     title: 'Register Page'
  //   }
  // },
  {path: '**', component:Page404Component}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      
      // relativeLinkResolution: 'legacy'
    })
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy} 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
