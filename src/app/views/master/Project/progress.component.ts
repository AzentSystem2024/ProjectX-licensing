import { Component,OnInit,ViewChild } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../../../dialogs/add-product-dialog/add-product-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  displayedColumns: string[] = ['code', 'productname','productkey','action'];
  dataSource:any;
  listProduct:any;

  constructor(
    public service:MyserviceService,private dialog: MatDialog) {}
  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;

  Filterchange(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;
    
    // Custom filter predicate to exclude password column from filtering
    const customFilterPredicate = (data: any, filter: string) => {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (key !== 'ID' &&data[key]&&data[key].toString().toLowerCase().includes(filter.toLowerCase())) {
          return true; // Include row if any non-password column matches the filter
        }
      }
      return false; // Exclude row if no non-password column matches the filter
    };
  
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = customFilterPredicate;
  
    
  }

  getProductData(){
    this.service.getProduct().subscribe(
      (res:any) => {
       
    
        console.log(res);
        this.listProduct=res;
        console.log('after',this.listProduct);
        this.dataSource=new MatTableDataSource<any>(this.listProduct)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;

      },
      
     
      // (error:any) => {
      //   console.error(error);
      // }
    );
    
  }

  ngOnInit(): void {
    this.getProductData();
  }
  openProductPopup(){
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '450px',
      height: '550px',
  });
  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getProductData();
      }
    });
  }
  editProduct(productId:number):void{
    const dialogRef = this.dialog.open(AddProductDialogComponent,{
      width: '450px',
      height: '550px',
      data: {
        id:productId,
        mode:'update'
  
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getProductData();
        }
      });
    
  
  }
  deleteProduct(productId:number){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteProduct(productId).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getProductData();
          }
        );
      }
      
    });

  }

}
