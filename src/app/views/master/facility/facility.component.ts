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
  editFacility(facility:any):void{
    const dialogRef = this.dialog.open(AddFacilityComponent,{
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
    const dialogRef = this.dialog.open(AddFacilityComponent, {
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
