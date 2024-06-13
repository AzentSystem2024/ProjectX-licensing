import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RenewLicenseDialogComponent } from '../renew-license-dialog/renew-license-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {NoSelectionDialogComponent} from '../no-selection-dialog/no-selection-dialog.component';

@Component({
  selector: 'app-view-menu',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatTableModule,MatCardModule,MatTooltipModule,MatCheckboxModule,MatPaginatorModule],
  templateUrl: './view-menu.component.html',
  styleUrl: './view-menu.component.scss'
})
export class ViewMenuComponent {

  @ViewChild(MatPaginator) paginator!:MatPaginator;


  editionMenuList:any;
  dataSource:any;
  displayedColumns: string[] = ['slno','menu-group','menu-name','version','module','remarks'];
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,
  private dialogRef: MatDialogRef<ViewMenuComponent>,private dialog:MatDialog){
    service.getEditionMenu().subscribe(data=>{
      this.editionMenuList=data;
      const menuFiltered = this.editionMenuList.filter((item: any) => item.EDITION_NAME == this.data.customer.EDITION_NAME);
      this.dataSource = new MatTableDataSource<any>(menuFiltered);
      this.dataSource.paginator = this.paginator;
    
  })
}

  
 

  closeDialog(){
    this.dialogRef.close();
  }

}
