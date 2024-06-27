import { Component,OnInit,ViewChild } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from '../../../dialogs/add-customer-dialog/add-customer-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import {ViewCustomerComponent} from '../../../dialogs/view-customer/view-customer.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ViewMenuComponent} from '../../../dialogs/view-menu/view-menu.component';



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = ['expand','code', 'name','customerkey','facilitycount','resellername','country','action'];
  dataSource:any;
  listCustomers: any[] = [
    {ID: 4, CUST_NAME: 'DILIGENZ SYSTEMS MIDDLE EAST',CUST_CODE:'123', CUSTOMER_KEY: 'XCTY-GHBG8-P8JHB', CONTACT_NAME: 'cust1', RESELLER_NAME: 'reseller1', COUNTRY_NAME: 'india'}
];
  expandedElement: any | null;
  showFacility=false;
  levelName:any;
  
  constructor(
    public service:MyserviceService,private dialog: MatDialog
  ) { 
    this.levelName=service.getlevelName();
  }
  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;

  // toggleRow(row: any) {
  //   this.expandedElement = this.expandedElement === row ? null : row;
  //   console.log('expanded',this.expandedElement);

  // }

  Filterchange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Use the default filterPredicate but set it up to ignore specific columns.
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Define the keys to be ignored in the filtering process.
      const excludedColumns = ['slNo'];
      
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


  getCustomerData(){
    console.log('levelname',this.levelName)
    if (this.levelName === 'Reseller') {
      const resellerId = this.service.getUserId(); 
      console.log('customerid',resellerId)
      // Assuming you have a method to get the reseller ID from service
      this.service.getCustomers().subscribe(
        (res: any[]) => {
          console.log('customerdata',res);
          this.listCustomers = res.filter(customer => customer.USER_ID === resellerId);
          console.log('reseller customer data',this.listCustomers)
          this.dataSource = new MatTableDataSource<any>(this.listCustomers);
          this.dataSource.paginator = this.paginatior;
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      // Load all customers for non-reseller users
    this.service.getCustomers().subscribe(
      (res:any) => {
        console.log(res);
        this.listCustomers=res;
        console.log('after',this.listCustomers);


        this.dataSource=new MatTableDataSource<any>(this.listCustomers)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;

      },
      
     
      // (error:any) => {
      //   console.error(error);
      // }
    );
    }
  }
  
  openCustomerPopup(){
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
    width: isMobile ? '100vw' : '690px',
    height: isMobile ? '100vh' : '610px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
  
  });
  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getCustomerData();
      }
    });

  }

  editCustomer(customer:any):void{
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddCustomerDialogComponent,{
    width: isMobile ? '100vw' : '690px',
    height: isMobile ? '100vh' : '610px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id:customer.ID,
        customer:customer,
        mode:'update'
  
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getCustomerData();
        }
      });
    
  
  }
  deleteCustomer(ID:any,customer:any):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?',
        title:'Customer' 
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteCustomer(ID,customer).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getCustomerData();
          }
        );
      }
      
    });
  }

  viewCustomer(customer:any){
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(ViewCustomerComponent,{
    width: isMobile ? '100vw' : '70vw',
    height: isMobile ? '100vh' : '90vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    position: { top: '50px', right: '130px' }, 
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id:customer.ID,
        customer:customer,
        mode:'view'
  
      }
  
    });
  }

  viewMenu(customer:any){
    const dialogRef = this.dialog.open(ViewMenuComponent,{
      width: '70vw', // 70% of the viewport width
      maxWidth: '100vw', // maximum width to ensure it doesn't overflow
      height: '82vh', // 85% of the viewport height
      maxHeight: '100vh', // maximum height to ensure it doesn't overflow
      data: {
        name:customer.CUST_NAME,
        id:customer.ID,
        customer:customer,
        mode:'view'
  
      }
  
    });
  }
  ngOnInit(): void {
    
    this.getCustomerData();
  
    }
  
}
