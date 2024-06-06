import { Component, OnInit,ViewChild,OnDestroy } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddLicenseDialogComponent } from '../../../dialogs/add-license-dialog/add-license-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { RenewLicenseDialogComponent } from '../../../dialogs/renew-license-dialog/renew-license-dialog.component';

type ModeType ='add' | 'update' | 'view';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})



export class ButtonsComponent implements OnInit,OnDestroy {
  

  displayedColumns: string[] = ['cust-name','company-name', 'prod-name','licensekey','licensevalidity','amcvalidity','status','action'];
  dataSource:any;
  listLicense:any;
  
  dialogRef!: MatDialogRef<any>;
  dialogSubscription!: Subscription;
  constructor(
    public service:MyserviceService,private dialog: MatDialog,
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

  //filter
  Filterchange(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;
    
    // Custom filter predicate to exclude password column from filtering
    const customFilterPredicate = (data: any, filter: string) => {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (key !== 'ID'&&key!=='PRODUCT_ID'&&key!=='CUST_ID'&&key!=='LICENSETYPE_ID'&&key!=='COMPANY_ID'&&key!=='USER_ID'&&data[key]&&data[key].toString().toLowerCase().includes(filter.toLowerCase())) {
          return true; // Include row if any non-password column matches the filter
        }
      }
      return false; // Exclude row if no non-password column matches the filter
    };
  
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = customFilterPredicate;
  
    
  }

  editLicense(licenseId:number){
    const license = this.listLicense.find((license: any) => license.ID === licenseId);

    let mode: ModeType = 'update';

    if (license.STATUS === 'Registered' || license.STATUS === 'Expired') {
      mode = 'view';
    }
    const dialogRef = this.dialog.open(AddLicenseDialogComponent,{
      width: '480px',
      height: '550px',
      data: {
        id:licenseId,
        mode:mode 
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getLicenseData();
        }
      });
  }

  renewLicense(licenseId:number){
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent,{
      width:'400px',
      height:'400px',
      data:{
        id:licenseId
      }

    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='insert') {
          this.getLicenseData();
        }
      });


  }



  deleteLicense(ID:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteLicense(ID).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getLicenseData();
          }
        );
      }
      
    });
  }

  openLicensePopup(){
    const dialogRef = this.dialog.open(AddLicenseDialogComponent, {
      width: '500px',
      height: '640px',
  });
  this.dialogSubscription = dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getLicenseData();
      }
    });
  }

  ngOnInit(): void {
    this.getLicenseData();
  }
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  
}
