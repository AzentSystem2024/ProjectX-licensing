import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetModule, MyserviceService } from 'src/app/myservice.service';
import { AddModuleDialogComponent } from '../../../dialogs/add-module-dialog/add-module-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})
export class ModuleComponent implements OnInit{
  displayedColumns: string[] = [ 'slNo','Menu Group', 'Action'];
  modules!: GetModule[];
  dataSource: any;

  constructor(public service: MyserviceService,private dialog: MatDialog){}

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sortt!: MatSort;

  ngOnInit(): void {
    this.getModule()
  }

  getModule() {
    this.service.getModule().subscribe((data: any) => {
      this.modules = data;
      console.log(data, 'modulesssssss');
      this.dataSource = new MatTableDataSource<GetModule>(this.modules);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sortt;
    });
  }

  openModulePopup(){
    const dialogRef = this.dialog.open(AddModuleDialogComponent, {
      width: '400px',
      height:'300px',
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='insert') {
          this.getModule();
        }
      });
    }
  


  Filterchange(data : Event){

  }

  editModule(moduleId:number):void{
    const dialogRef = this.dialog.open(AddModuleDialogComponent,{
      width: '400px',
      height:'300px',
      data: {
        id:moduleId,
        mode:'update'
  
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getModule();
        }
      });
  }

  deleteModule(ID:number, module:any):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteModule(ID,module).subscribe(
          (res: any) => {
            console.log('module is deleted', res);
            this.getModule();
          }
        );
      }
      
    });
  }

}