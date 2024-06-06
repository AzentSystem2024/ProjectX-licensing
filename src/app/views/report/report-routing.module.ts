import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenseReportComponent} from './license-report/license-report.component';

const routes: Routes = [
  {
    path: 'report',
    data: {
      title: 'Report'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'licensereport'
      },
      {
        path: 'licensereport',
        component: LicenseReportComponent,
        data: {
          title: 'License Report'
        }
      },
      
    ]
  }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReportRoutingModule {
  }