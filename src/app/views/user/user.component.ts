import { filter } from 'rxjs/operators';
import { EditUserDialogComponent } from '../../edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from '../../dialogs/add-user-dialog/add-user-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { MyserviceService,Getdata } from '../../myservice.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-charts',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private dialog: MatDialog,public details:MyserviceService, private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
  }

  

  showNoDataFoundMessage: boolean = false;

  Getdata!:Getdata[];
  dataSource:any;

  displayedColumns: string[] = ['userName', 'loginName', 'userLevel', 'status', 'action'];

  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;

  openpopup(){
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: isMobile ? '100vw' : '400px',
    height: isMobile ? '100vh' : '500px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling

  });

  dialogRef.afterClosed().subscribe(result => {
    if (result==='insert') {
      this.getUserData();
    }
    
  });

}

Filterchange(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

  // Use the default filterPredicate but set it up to ignore specific columns.
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    // Define the keys to be ignored in the filtering process.
    const excludedColumns = ['PASSWORD', 'ID', 'USER_LEVEL'];
    
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

  getUserData(){
    this.details.getUsers().subscribe(
      (res:any) => {
       
    
        console.log(res);
        this.Getdata=res;
        console.log('after',this.Getdata);
        this.dataSource=new MatTableDataSource<Getdata>(this.Getdata)
        this.dataSource.paginator=this.paginatior;
        this.dataSource.sort=this.sortt;

      },
      
     
      // (error:any) => {
      //   console.error(error);
      // }
    );
    
  }

  deleteUser(ID: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.details.deleteUsers(ID,{}).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getUserData();
          }
        );
      }
      
    });
  }

  editUser(userId:number):void{
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddUserDialogComponent,{
    width: isMobile ? '100vw' : '400px',
    height: isMobile ? '100vh' : '500px',
    maxWidth: '100vw',
    maxHeight: '100vh',
    panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id:userId,
        mode:'update'
  
      }
  
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result==='update') {
        this.getUserData();
      }
      
    });
  
  }
  

  ngOnInit(): void {
    
    this.getUserData();
  
    }


  

}
