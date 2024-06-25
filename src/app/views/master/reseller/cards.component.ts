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

  //open reseller popup
  openResellerPopup(){
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddResellerDialogComponent, {
    width: isMobile ? '100vw' : '600px',
    height: isMobile ? '100vh' : '400px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
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
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddResellerDialogComponent,{
    width: isMobile ? '100vw' : '600px',
    height: isMobile ? '100vh' : '400px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
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
