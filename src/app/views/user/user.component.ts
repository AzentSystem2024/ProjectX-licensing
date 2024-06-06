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
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      height: '500px',
      
    
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result==='insert') {
      this.getUserData();
    }
    
  });

}

Filterchange(data: Event) {
  const filterValue = (data.target as HTMLInputElement).value;
  
  // Custom filter predicate to exclude password column from filtering
  const customFilterPredicate = (data: any, filter: string) => {
    const keys = Object.keys(data);
    for (const key of keys) {
      if (key !== 'PASSWORD' && key !== 'ID' && key !== 'USER_LEVEL'&& data[key].toString().toLowerCase().includes(filter.toLowerCase())) {
        return true; // Include row if any non-password column matches the filter
      }
    }
    return false; // Exclude row if no non-password column matches the filter
  };

  this.dataSource.filter = filterValue.trim().toLowerCase();
  this.dataSource.filterPredicate = customFilterPredicate;

  
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
        this.details.deleteUsers(ID).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getUserData();
          }
        );
      }
      
    });
  }

  editUser(userId:number):void{

    const dialogRef = this.dialog.open(AddUserDialogComponent,{
      width: '400px',
      height: '530px',
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
