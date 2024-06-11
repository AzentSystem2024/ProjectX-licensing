import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetMenuGroup, MyserviceService } from 'src/app/myservice.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddMenuGroupComponent } from '../../../dialogs/add-menu-group/add-menu-group.component'
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-menu-group',
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
  templateUrl: './menu-group.component.html',
  styleUrl: './menu-group.component.scss',
})
export class MenuGroupComponent implements OnInit {
  displayedColumns: string[] = [ 'slNo','Menu Group', 'Action'];
  menuGroup!: GetMenuGroup[];
  dataSource: any;

  constructor(public service: MyserviceService,private dialog: MatDialog,) {}

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sortt!: MatSort;

  ngOnInit(): void {
    this.getMenuGroup();
  }

  getMenuGroup() {
    this.service.getMenuGroup().subscribe((data: any) => {
      this.menuGroup = data;
      console.log(data, 'menugrouppppppppppp');
      this.dataSource = new MatTableDataSource<GetMenuGroup>(this.menuGroup);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sortt;
    });
  }

  Filterchange(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value;

    // Custom filter predicate to exclude password column from filtering
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

  openMenuGroupPopup(){
    const dialogRef = this.dialog.open(AddMenuGroupComponent, {
      width: '600px',
      height:'400px',
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='insert') {
          this.getMenuGroup();
        }
      });
    }

    editMenuGroup(menuGroupId:number):void{
      const dialogRef = this.dialog.open(AddMenuGroupComponent,{
        width: '600px',
        height:'400px',
        data: {
          id:menuGroupId,
          mode:'update'
    
        }
    
      });
      dialogRef.afterClosed().subscribe(
        result => {
          if (result==='update') {
            this.getMenuGroup();
          }
        });
      
    
    }

    deleteMenuGroup(ID:number, menuGroup:any):void{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Are you sure you want to delete this data?'
    
        }
      });
    
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.deleteGroupMenu(ID,menuGroup).subscribe(
            (res: any) => {
              console.log('user is deleted', res);
              this.getMenuGroup();
            }
          );
        }
        
      });
    }

  }

