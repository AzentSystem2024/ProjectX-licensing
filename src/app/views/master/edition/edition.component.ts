import { Component, OnInit,ViewChild } from '@angular/core';
import { GetEdition, MyserviceService } from 'src/app/myservice.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource,MatTableModule} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddEditionDialogComponent } from 'src/app/dialogs/add-edition-dialog/add-edition-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-edition',
  standalone: true,
  imports: [CommonModule,MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatFormFieldModule,MatLabel,MatTableModule,MatCardModule,MatIconModule,MatPaginatorModule],
  templateUrl: './edition.component.html',
  styleUrl: './edition.component.scss'
})
export class EditionComponent {

  @ViewChild(MatPaginator) paginatior!:MatPaginator;
  
  @ViewChild(MatSort) sortt!:MatSort;
  listEdition: any;
  dataSource:any;
  displayedColumns: string[] = ['slNo','edition_name','action'];
  edition!: GetEdition[];
  constructor(public service:MyserviceService,private dialog:MatDialog){}

  openEditionPopup(){
    
    const dialogRef = this.dialog.open(AddEditionDialogComponent, {
      width: '900px',
      height: '630px',
  
  });
  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='insert') {
        this.getEditionData();
      }
    });
}

deleteEdition(ID:any,edition:any):void{
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      message: 'Are you sure you want to delete this data?' 
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.deleteEdition(ID,edition).subscribe(
        (res: any) => {
          console.log('edition is deleted', res);
          this.getEditionData();
        }
      );
    }
    
  });
}


Filterchange(data: Event) {
}
getEditionData(){
  this.service.getEdition().subscribe(
    (res:any) => {
      console.log(res);
      this.listEdition=res;
      console.log(res,"edition========================")
      console.log('after',this.listEdition);
      this.dataSource=new MatTableDataSource<any>(this.listEdition)
      this.dataSource.paginator=this.paginatior;
      this.dataSource.sort=this.sortt;

    },
    (error:any) => {
      console.error(error);
    }
  );
}

editEdition(editionId : number){
  const dialogRef = this.dialog.open(AddEditionDialogComponent,{
    width: '900px',
    height:'630px',
    data: {
      id:editionId,
      mode:'update'

      
    }

  });
  dialogRef.afterClosed().subscribe(
    result => {
      if (result==='update') {
        this.getEditionData();
      }
    });
}

openEditDialog(editionId: number): void {
  this.service.getEditionById(editionId,{}).subscribe((editionData: any) => {
    const dialogRef = this.dialog.open(AddEditionDialogComponent, {
      data: {
        mode: 'update',
        id: editionId // Pass the edition ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any logic after the dialog is closed
    });
  });
}


ngOnInit(): void {
  this.getEditionData();
}
}
