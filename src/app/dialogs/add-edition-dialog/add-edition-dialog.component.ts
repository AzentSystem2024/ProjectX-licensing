import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators,FormArray, AbstractControl  } from '@angular/forms';
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
  submit = false;
  loading = false; // Loading flag
  displayedColumns: string[] = ['select','module','menu-group','menu-name','remarks'];
  dataSource: any;
  editionMenuList: any[] = [];
  selection = new SelectionModel<any>(true, []);
  mode: 'add' | 'update' = 'add';
  selsectedMenu : string | null = null
  editData: any;

  editionForm = this.fb.group({
    ID: [''],
    EDITION_NAME: ['', [Validators.required]],
    EDITION_MENU: this.fb.array([]) // FormArray for checkboxes
  });

  constructor(private service:MyserviceService, private fb:FormBuilder,private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddEditionDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any){
    }

    ngOnInit(){
      this.mode = this.data?.mode || 'add'; 
      console.log(this.data,"dataaaaaaaaaaaaaa")
      if(this.data && this.data.id){
        this.getEditionById(this.data.id, {});
      }
      this.getEditionMenuList()
    }

    get f() {
      return this.editionForm.controls;
    }

    noWhitespaceOrSpecialChar(
      control: AbstractControl
    ): { [key: string]: boolean } | null {
      const value = control.value;
      if (value && (value.charAt(0) === ' ' || !/^[a-zA-Z0-9]/.test(value))) {
        return { invalidFormat: true };
      }
      return null;
    }


    initializeForm() {
      this.service.getEditionMenuList().subscribe(data => {
        this.editionMenuList = data;
        console.log(this.editionMenuList,"edition menu list]]]]]")
        this.dataSource = new MatTableDataSource<any>(this.editionMenuList);
        this.dataSource.paginator = this.paginator;
    
        // Initialize the EDITION_MENU FormArray with checkboxes
        this.editionMenuList.forEach(() => {
          (this.editionForm.get('EDITION_MENU') as FormArray).push(this.fb.control(false));
        });
      });
    }
    

  getEditionById(id: number, data: any) {
    this.service.getEditionById(id, data).subscribe((res: any) => {
      console.log(res.edition_menu,"edition by iddddddddddddddddddddddd';;'';;")
      this.editionForm.patchValue({
        ID: res.ID,
        EDITION_NAME: res.EDITION_NAME,
        EDITION_MENU : res.edition_menu
      });

      // Set the selected menus
      const selectedMenuIds = res.edition_menu.map((menu: any) => menu.MENU_ID);
      console.log(selectedMenuIds,"SELECTEDMENUID")
      this.editionMenuList.forEach((menu: any, index: number) => {
        // console.log(`Processing menu:`, menu);
        if (selectedMenuIds.includes(menu.MENU_ID)) {
          console.log(`Menu ID ${menu.MENU_ID} is selected`);
          (this.editionForm.get('EDITION_MENU') as FormArray).at(index).setValue(true);
        } else {
          console.log(`Menu ID ${menu.MENU_ID} is not selected`); // Log if the menu is not selected
        }
      });
    });
  }

  getEditionMenuList() {
    this.service.getEditionMenuList().subscribe(data => {
      this.editionMenuList = data;
      console.log(this.editionMenuList,"EDITIONMENULISTTTTTTTTTTT")
      this.dataSource = new MatTableDataSource<any>(this.editionMenuList);
      this.dataSource.paginator = this.paginator;

      // Initialize the EDITION_MENU FormArray with checkboxes
      this.editionMenuList.forEach(() => {
        (this.editionForm.get('EDITION_MENU') as FormArray).push(this.fb.control(false));
      });
    });
  }



// }

onSubmit() {
  this.submit = true;
  const editionMenu = this.editionForm.get('EDITION_MENU');

  if (editionMenu) {
    const selectedMenus = (editionMenu.value as boolean[])
      .map((selected: boolean, index: number) => (selected ? this.editionMenuList[index] : null))
      .filter((menu: any) => menu !== null);

    const menuIds = selectedMenus.map(menu => ({ MENU_ID: menu.MENU_ID }));

    const postData: any = {
      ID: this.editionForm.value.ID,
      EDITION_NAME: this.editionForm.value.EDITION_NAME,
      EDITION_MENU: menuIds
    };

    console.log('Form Data:', postData);

    if (this.editionForm.valid) {
      if (this.mode === 'add') {
        this.service.addEdition(postData).subscribe(data => {
          console.log('Edition added:', data);
          this.openEditionAddedDialog("Edition", "Edition added successfully");
          this.dialogRef.close('insert');
        }, error => {
          console.error('Error adding edition:', error);
        });
      } else {
        this.service.updateEdition(postData).subscribe(data => {
          console.log('Edition updated:', data);
          this.openEditionAddedDialog("Edition", "Edition updated successfully");
          this.dialogRef.close('update');
        }, error => {
          console.error('Error updating edition:', error);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  } else {
    console.log('EditionMenu is not defined');
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
    if (!this.dataSource) {
      return false; 
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  // Selects all rows if they are not all selected; otherwise clear selection
  toggleAllRows() {
    if (!this.dataSource) {
      return; // Do nothing if dataSource is not yet defined
    }
  
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



