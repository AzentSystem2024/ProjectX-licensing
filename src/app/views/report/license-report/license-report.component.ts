import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-license-report',
  standalone: true,
  imports: [CommonModule,FormsModule,MatCardModule,MatPaginator,MatTableModule,MatIconModule],
  templateUrl: './license-report.component.html',
  styleUrl: './license-report.component.scss'
})
export class LicenseReportComponent implements OnInit {

  displayedColumns: string[] = ['cust-name','company-name', 'prod-name','licensekey','licensevalidity','amcvalidity','status'];
  dataSource:any;
  showDateFilter=true;
  selectedStatusFilters: string[] = [];
  selectedTypeFilters: string[] = [];
  listLicense:any;
  fromDate!: Date;
  toDate!: Date;
  constructor(
    public service:MyserviceService,private dialog: MatDialog
  ) { }
  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;

  getLicenseData(){
    this.service.getLicense().subscribe(
      (res:any) => {
       
    
        console.log(res);
        this.listLicense=res;
        console.log('after',this.listLicense);
        this.dataSource=new MatTableDataSource<any>(this.listLicense)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;

      },
      
     
      // (error:any) => {
      //   console.error(error);
      // }
    );
    
  }

  updateToDate() {
    // Ensure fromDate is defined before updating toDate
    if (this.fromDate) {
      const fromDate = new Date(this.fromDate);
      // Set toDate to be one day ahead of fromDate
      fromDate.setDate(fromDate.getDate() + 1);
      this.toDate = fromDate;
    }
  }


  applyDateFilter() {
  if (!this.fromDate || !this.toDate) {
   
    this.dataSource.data = this.listLicense;
    return;
  }

  const fromDateValue = new Date(this.fromDate).setHours(0, 0, 0, 0);
  const toDateValue = new Date(this.toDate).setHours(0, 0, 0, 0);
  console.log('fromdate',fromDateValue);

  const filteredData = this.listLicense.filter((license: any) => {
    const expiryDate = new Date(license.EXPIRY_DATE).getTime();
    return fromDateValue <= expiryDate && expiryDate <= toDateValue;
  });

  this.dataSource.data = filteredData;
}

applyStatusFilter() {
  console.log("Selected Status Filters:", this.selectedStatusFilters);
  // If "All" is selected, show all data
  if (this.selectedStatusFilters.includes('all')) {
      this.showDateFilter=false;
      this.dataSource.data = this.listLicense;
      return;
  }
  else{
    this.showDateFilter=true;
  }
  if (this.selectedStatusFilters.includes('Open')) {
    this.showDateFilter = false;
  }

  // Filter data based on selected status filters
  const filteredData = this.listLicense.filter((license:any) => {
      return this.selectedStatusFilters.includes(license.STATUS);
  });

  // Update the table data source with the filtered data
  this.dataSource.data = filteredData;
}

applyTypeFilter() {
  console.log("Selected Type Filters:", this.selectedStatusFilters);
  // If "All" is selected, show all data
  if (this.selectedTypeFilters.includes('all')) {
      this.dataSource.data = this.listLicense;
      return;
  }

  // Filter data based on selected status filters
  const filteredData = this.listLicense.filter((license:any) => {
      return this.selectedTypeFilters.includes(license.TYPE_NAME);
  });

  // Update the table data source with the filtered data
  this.dataSource.data = filteredData;
}

  ngOnInit(): void {
    this.getLicenseData();
  }

  exportToExcel() {
    const data = this.dataSource.data.map((license:any) => ({
        'Customer Name': license.CUST_NAME,
        'Company Name': license.COMPANY_NAME,
        'Product Name': license.PRODUCT_NAME,
        'License Type': license.TYPE_NAME,
        'License Key': license.LICENSE_KEY,
        'Expiry Date': license.EXPIRY_DATE,
        'Status': license.STATUS
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveExcelFile(excelBuffer, 'your_file_name.xlsx');
}
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: 'application/octet-stream'});
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}
}
