import { Component, OnInit,ViewChild } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddFacilityComponent } from 'src/app/dialogs/add-facility/add-facility.component';
import { AddCustomerDialogComponent } from 'src/app/dialogs/add-customer-dialog/add-customer-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';




@Component({
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent implements OnInit {
  displayedColumns: string[] = ['customer-name','address','facility-license','facility-name','emirate','post-office','action'];
  dataSource:any;
  listFacility:any;

  constructor(public service:MyserviceService,private dialog:MatDialog) {}
  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;

  getFacilityData(){
    this.service.getFacility().subscribe(
      (res:any) => {
        console.log(res);
        this.listFacility=res;
        console.log('after',this.listFacility);
        this.dataSource=new MatTableDataSource<any>(this.listFacility)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;
      },
    );
    
  }

  Filterchange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Use the default filterPredicate but set it up to ignore specific columns.
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Define the keys to be ignored in the filtering process.
      const excludedColumns = [''];
      
      // Check each field in the row except the excluded columns for a match.
      return Object.keys(data).some(key => {
        if (!excludedColumns.includes(key)) {
          return data[key]?.toString().toLowerCase().includes(filter);
        }
        return false;
      });
    };
  
    this.dataSource.filter = filterValue;
  }

  editFacility(facility:any):void{
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddFacilityComponent,{
    width: isMobile ? '100vh' : '800px',
    height: isMobile ? '100vh' : '680px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id:facility.ID,
        facility:facility,
        mode:'update'
  
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getFacilityData();
        }
      });
    
  
  }
  openFacilityPopup(){
    
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddFacilityComponent, {
    width: isMobile ? '100vh' : '800px',
    height: isMobile ? '100vh' : '680px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        existingFacilities: this.listFacility // Pass the existing facilities
      }
  
  });
  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getFacilityData();
      }
    });

  }
  deleteFacility(ID:any,facility:any):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?' 
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteFacility(ID,facility).subscribe(
          (res: any) => {
            console.log('facility is deleted', res);
            this.getFacilityData();
          }
        );
      }
      
    });
  }
  
  

  ngOnInit(): void {

    this.getFacilityData();   
  }
}
export class FacilityModule{}
