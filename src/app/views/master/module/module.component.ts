import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetModule, MyserviceService } from 'src/app/myservice.service';
import { AddModuleDialogComponent } from '../../../dialogs/add-module-dialog/add-module-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

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
  styleUrl: './module.component.scss',
})
export class ModuleComponent implements OnInit {
  displayedColumns: string[] = ['slNo', 'Menu Group', 'Action'];
  modules!: GetModule[];
  dataSource: any;

  constructor(public service: MyserviceService, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sortt!: MatSort;

  ngOnInit(): void {
    this.getModule();
  }

  getModule() {
    this.service.getModule().subscribe((data: any) => {
      this.modules = data;
      this.dataSource = new MatTableDataSource<GetModule>(this.modules);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sortt;
    });
  }

  openModulePopup() {
    // Determine if the device is mobile
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddModuleDialogComponent, {
      width: isMobile ? '100vw' : '400px',
      height: isMobile ? '100vh' : '300px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'insert') {
        this.getModule();
      }
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

  editModule(moduleId: number): void {
    const isMobile = window.innerWidth < 768;
    const dialogRef = this.dialog.open(AddModuleDialogComponent, {
      width: isMobile ? '100vw' : '400px',
      height: isMobile ? '100vh' : '300px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: isMobile ? 'full-screen-dialog' : '', // Optional: custom class for further styling
      data: {
        id: moduleId,
        mode: 'update',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'update') {
        this.getModule();
      }
    });
  }

  deleteModule(ID: number, module: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this data?',
        title:'Module',
  
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteModule(ID, module).subscribe((res: any) => {
          if (res) {
            this.openModuleAddedDialog('Module', 'Module deleted successfully');
            console.log('module deleted', res);
            this.getModule();
          } else {
            this.openModuleAddedDialog('Module', 'Delete operation failed');
          }
        });
      }
    });
  }

  openModuleAddedDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }
}
