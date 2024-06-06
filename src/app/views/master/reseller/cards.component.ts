import { Component,ViewChild,OnInit } from '@angular/core';
import { MyserviceService,GetResellerData } from 'src/app/myservice.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddResellerDialogComponent } from '../../../dialogs/add-reseller-dialog/add-reseller-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'phone', 'email', 'country', 'action'];

  listResller!:GetResellerData[];
  dataSource:any;

  constructor(private dialog: MatDialog,public service:MyserviceService, private fb:FormBuilder, private route:ActivatedRoute,private router:Router) { }

  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;
  
  //filter
  Filterchange(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;
    
    // Custom filter predicate to exclude password column from filtering
    const customFilterPredicate = (data: any, filter: string) => {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (key !== 'ID' && key !== 'COUNTRY_ID' && data[key].toString().toLowerCase().includes(filter.toLowerCase())) {
          return true; // Include row if any non-password column matches the filter
        }
      }
      return false; // Exclude row if no non-password column matches the filter
    };
  
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = customFilterPredicate;
  
    
  }

  //open reseller popup
  openResellerPopup(){
    const dialogRef = this.dialog.open(AddResellerDialogComponent, {
      width: '600px',
      height:'400px',
  });

  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getResellerData();
      }
    });
  }

  getResellerData(){
    this.service.getResellers().subscribe(
      (res:any) => {
       
    
        console.log(res);
        this.listResller=res;
        console.log('after',this.listResller);
        this.dataSource=new MatTableDataSource<GetResellerData>(this.listResller)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;

      },
      
     
      // (error:any) => {
      //   console.error(error);
      // }
    );
    
  }
  deleteReseller(ID:number):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteReseller(ID).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getResellerData();
          }
        );
      }
      
    });
  }

  editReseller(userId:number):void{
    const dialogRef = this.dialog.open(AddResellerDialogComponent,{
      width: '600px',
      height:'400px',
      data: {
        id:userId,
        mode:'update'
  
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getResellerData();
        }
      });
    
  
  }

  ngOnInit(): void {
    
    this.getResellerData();
  
    }


}
