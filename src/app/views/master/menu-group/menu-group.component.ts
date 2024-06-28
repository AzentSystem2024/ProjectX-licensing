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
import { AddMenuGroupComponent } from '../../../dialogs/add-menu-group/add-menu-group.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

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
  displayedColumns: string[] = ['slNo', 'Menu Group', 'Menu Order', 'Action'];
  menuGroup!: GetMenuGroup[];
  dataSource: any;

  constructor(public service: MyserviceService, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sortt!: MatSort;

  ngOnInit(): void {
    this.getMenuGroup();
  }

  getMenuGroup() {
    this.service.getMenuGroup().subscribe((data: any) => {
      this.menuGroup = data;
      this.dataSource = new MatTableDataSource<GetMenuGroup>(this.menuGroup);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sortt;
    });
  }

  Filterchange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // Use the default filterPredicate but set it up to ignore specific columns.
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Define the keys to be ignored in the filtering process.
      const excludedColumns = ['slNo'];

      // Check each field in the row except the excluded columns for a match.
      return Object.keys(data).some((key) => {
        if (!excludedColumns.includes(key)) {
          return data[key]?.toString().toLowerCase().includes(filter);
        }
        return false;
      });
    };

    this.dataSource.filter = filterValue;
  }

  openMenuGroupPopup() {
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddMenuGroupComponent, {
      width: isMobile ? '100vw' : '500px',
      height: isMobile ? '100vh' : '400px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'insert') {
        this.getMenuGroup();
      }
    });
  }

  editMenuGroup(menuGroupId: number): void {
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddMenuGroupComponent, {
      width: isMobile ? '100vw' : '500px',
      height: isMobile ? '100vh' : '400px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id: menuGroupId,
        mode: 'update',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'update') {
        this.getMenuGroup();
      }
    });
  }

  deleteMenuGroup(ID: number, menuGroup: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteGroupMenu(ID, menuGroup).subscribe((res: any) => {
          if (res) {
            if (res.flag === '0') {
              this.openMenuAddedDialog(
                'Menu Group',
                'This menu group cannot be deleted: '
              );
            } else {
              this.openMenuAddedDialog(
                'Menu Group',
                'Menu Group deleted successfully'
              );
              console.log('menu deleted', res);
              this.getMenuGroup();
            }
          } else {
            this.openMenuAddedDialog('Menu Group', 'Delete operation failed');
          }
          this.getMenuGroup();
        });
      }
    });
  }

  openMenuAddedDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }
}
