import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetMenu, MyserviceService } from 'src/app/myservice.service';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AddMenuDialogComponent } from '../../../dialogs/add-menu-dialog/add-menu-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  displayedColumns: string[] = [
    'slNo',
    'Module',
    'Menu Group',
    'Menu',
    'Available from version',
    'Remarks',
    'Action',
  ];
  menu!: GetMenu[];
  dataSource: any;
  dropdownList: any[] = [];
  formGroup: FormGroup;

  constructor(
    public service: MyserviceService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({});
  }

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getMenu();
    this.getModuleList();
  }

  getMenu() {
    this.service.getMenu().subscribe((data: any) => {
      this.menu = data;
      console.log(data, 'menu list');
      this.dataSource = new MatTableDataSource<GetMenu>(this.menu);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  deleteMenu(ID:number, menu:any):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?'
  
      }
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteMenu(ID,menu).subscribe(
          (res: any) => {
            console.log('user is deleted', res);
            this.getMenu();
          }
        );
      }
      
    });
  }

  editMenu
  (menuId:number):void{
    const dialogRef = this.dialog.open(AddMenuDialogComponent,{
      width: '600px',
      height:'400px',
      data: {
        id:menuId,
        mode:'update'
  
        
      }
  
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='update') {
          this.getMenu();
        }
      });
  }

  openMenuPopup() {
    const dialogRef = this.dialog.open(AddMenuDialogComponent, {
      width: '600px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'insert') {
        this.getMenu();
      }
    });
  }

  Filterchange(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;
    const customFilterPredicate = (data: any, filter: string) => {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (
          key !== 'PRODUCT_NAME' &&
          key !== 'MENU_GROUP' &&
          data[key].toString().toLowerCase().includes(filter.toLowerCase())
        ) {
          return true; 
        }
      }
      return false;
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = customFilterPredicate;
  }

  getModuleList() {
    this.service.getDropdownList().subscribe(
      (data: any) => {
        this.dropdownList = data;
        console.log(data, 'dropdown-modulesss');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
