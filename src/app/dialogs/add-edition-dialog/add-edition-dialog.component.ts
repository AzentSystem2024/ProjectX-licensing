import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MyserviceService } from 'src/app/myservice.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-edition-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatSelectModule,ReactiveFormsModule,MatFormFieldModule,
    MatLabel,MatError,MatCheckboxModule,MatPaginatorModule,MatTableModule,MatCardModule],
  templateUrl: './add-edition-dialog.component.html',
  styleUrl: './add-edition-dialog.component.scss'
})
export class AddEditionDialogComponent {

  @ViewChild(MatPaginator) paginator!:MatPaginator;

  loading = false; // Loading flag
  displayedColumns: string[] = ['select','module','menu-group','menu-name','remarks'];
  dataSource: any;
  editionMenuList:any;
  selection = new SelectionModel<any>(true, []);

  constructor(private service:MyserviceService, private fb:FormBuilder,private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddEditionDialogComponent>,){
      service.getEditionMenu().subscribe(data=>{
        this.editionMenuList=data;
        this.dataSource = new MatTableDataSource<any>(this.editionMenuList);
        this.dataSource.paginator = this.paginator;
      })
    }

  editionForm=this.fb.group({
    ID:[''],
    EDITION_NAME:['',[Validators.required]],
  });


  onSubmit(){
    const selectedMenus = this.selection.selected;
    console.log('selected menus',selectedMenus);

    const menuIds = selectedMenus.map(menu => ({ MENU_ID: menu.MENU_ID }));

    const postData:any={
      EDITION_NAME:this.editionForm.value.EDITION_NAME,
      EDITION_MENU: menuIds 
  }
  console.log('postdata',postData);

  if(this.editionForm.valid){
    this.service.addEdition(postData).subscribe(data=>{
      console.log('inserted edition values',data);
      this.openEditionAddedDialog("Edition", "Edition added successfully");
      this.dialogRef.close('insert');      
    })
  }
}
openEditionAddedDialog(title: string, message: string){
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { title: title, message: message }
});
}

  
  // Whether the number of selected elements matches the total number of rows 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  // Selects all rows if they are not all selected; otherwise clear selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
