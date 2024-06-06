import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {LicenseReportComponent} from './license-report/license-report.component';

@NgModule({
    
    imports: [
      LicenseReportComponent,
      CommonModule,
      MatCardModule,
      MatPaginatorModule,
      MatSortModule,
      MatFormFieldModule,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      
      
    ],
    exports: [
        LicenseReportComponent
      ]
  })
  export class ReportModule {
  }