import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RenewLicenseDialogComponent } from '../renew-license-dialog/renew-license-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {NoSelectionDialogComponent} from '../no-selection-dialog/no-selection-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';



@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatTableModule,MatCardModule,MatTooltipModule,MatCheckboxModule,
    MatPaginatorModule,MatTabsModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent implements OnInit {

  facilityList:any;
  facilityCount:number=0;
  activeCount:number=0;
  inactiveCount:number=0;
  expiredCount:number=0;
  editionMenuList:any;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  customer: any[] = [
    {ID: 4, CUST_NAME: 'DILIGENZ SYSTEMS MIDDLE EAST',CUST_CODE:'123', CUSTOMER_KEY: 'XCTY-GHBG8-P8JHB', CONTACT_NAME: 'cust1', RESELLER_NAME: 'reseller1', COUNTRY_NAME: 'india'}
];
  displayedColumns: string[] = ['select','slno','facility-name','post-office','license','enrolledon','expiry-date','status'];
  displayedColumns1: string[] = ['select','slno','menu-group','menu-name','version','module','remarks'];
  dataSource: any;
  dataSource1:any;
  levelName:any;
  selection = new SelectionModel<any>(true, []);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dataservice:MyserviceService,
  private dialogRef: MatDialogRef<ViewCustomerComponent>,private dialog:MatDialog){
    this.levelName=dataservice.getlevelName();
    dataservice.getEditionMenu().subscribe(data=>{
      this.editionMenuList=data;
      const menuFiltered = this.editionMenuList.filter((item: any) => item.EDITION_NAME == this.data.customer.EDITION_NAME);
      this.dataSource1 = new MatTableDataSource<any>(menuFiltered);
      this.dataSource1.paginator = this.paginator;
    
  })
  }

  fetchAndFilterFacilityData() {
    this.dataservice.getFacility().subscribe(datas => {
      this.facilityList = datas;
      // Filter the facility of customer by using id
      const facilityFiltered = this.facilityList.filter((item: any) => item.CUSTOMER_ID == this.data.id);
      // Filter the status
      const activeFacilities = facilityFiltered.filter((item: any) => item.IS_INACTIVE === 'False' || item.IS_INACTIVE === false);
      const inactiveFacilities = facilityFiltered.filter((item: any) => item.IS_INACTIVE === 'True' || item.IS_INACTIVE === true);

      const currentDate = new Date();
      const expiredFacilities = facilityFiltered.filter((item: any) => new Date(item.EXPIRY_DATE) < currentDate);

      // Get the count of expired Expiry date
      this.expiredCount = expiredFacilities.length;
      this.activeCount = activeFacilities.length;
      this.inactiveCount = inactiveFacilities.length;
      this.facilityCount = facilityFiltered.length;
      this.dataSource = new MatTableDataSource<any>(facilityFiltered);
      this.dataSource.paginator = this.paginator;
    });
  }

  // Whether the number of selected elements matches the total number of rows 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  // Selects all rows if they are not all selected; otherwise clear selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  renewLicense(){
    
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent,{
      width:'400px',
      height:'400px',
      data:{
        
      }

    });
  }
  renewAllLicenses() {
    if(this.selection.selected.length<1){
      this.dialog.open(NoSelectionDialogComponent, {
        width: '330px',
        height: '150px',
      });
      return;
    }

    //selected data
    const selectedFacilities = this.selection.selected;
    console.log('selected facilities',selectedFacilities);
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent, {
      width: '400px',
      height: '280px',
      data: {
        facilities: selectedFacilities,
        mode:'renewAll'
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='insert') {
          this.fetchAndFilterFacilityData();
        }
      });
  }
  


  ngOnInit(): void {
    this.fetchAndFilterFacilityData();
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
