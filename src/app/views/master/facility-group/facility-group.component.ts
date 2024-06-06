import { Component,OnInit,ViewChild } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerDialogComponent } from '../../../dialogs/add-customer-dialog/add-customer-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-facility-group',
  standalone: true,
  imports: [CommonModule,MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatFormFieldModule,MatLabel,MatTableModule,MatCardModule,MatIconModule,MatPaginatorModule],
  templateUrl: './facility-group.component.html',
  styleUrl: './facility-group.component.scss'
})
export class FacilityGroupComponent implements OnInit {
  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;
  listFacilityGroup: any;
  dataSource:any;
  displayedColumns: string[] = ['GROUP_NAME','action'];
  constructor(public service:MyserviceService){}

  openCustomerPopup(){   
}
Filterchange(data: Event) {
}
getFacillityGroupData(){
  this.service.getFacilityGroup().subscribe(
    (res:any) => {
     
  
      console.log(res);
      this.listFacilityGroup=res;
      console.log('after',this.listFacilityGroup);
      this.dataSource=new MatTableDataSource<any>(this.listFacilityGroup)
      this.dataSource.paginator=this.paginatior;
      this.dataSource.sort=this.sortt;

    },
    
   
    // (error:any) => {
    //   console.error(error);
    // }
  );
  
}
ngOnInit(): void {
  this.getFacillityGroupData();
}
}
