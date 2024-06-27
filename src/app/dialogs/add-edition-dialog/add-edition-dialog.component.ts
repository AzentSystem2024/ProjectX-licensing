


import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
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
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatError,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
  ],
  templateUrl: './add-edition-dialog.component.html',
  styleUrls: ['./add-edition-dialog.component.scss'],
})
export class AddEditionDialogComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  loading = false; // Loading flag
  displayedColumns: string[] = [
    'select',
    'module',
    'menu-group',
    'menu-name',
    'remarks',
  ];
  dataSource: any;
  editionMenuList: any[] = []; 
  selection: SelectionModel<any>;
  mode: 'add' | 'update' = 'add';

  constructor(
    private service: MyserviceService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddEditionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selection = new SelectionModel<any>(true, []); 
    this.mode = this.data?.mode || 'add';
    this.initializeForm();
  }

  editionForm = this.fb.group({
    ID: [''],
    EDITION_NAME: ['', [Validators.required]],
    EDITION_MENU: this.fb.array([]), // FormArray for checkboxes
  });

  initializeForm() {
    this.service.getEditionMenuList().subscribe((data) => {
      this.editionMenuList = data;
      this.dataSource = new MatTableDataSource<any>(this.editionMenuList);
      this.dataSource.paginator = this.paginator;

      // Initialize the EDITION_MENU FormArray with checkboxes
      this.editionMenuList.forEach(() => {
        (this.editionForm.get('EDITION_MENU') as FormArray).push(
          this.fb.control(false)
        );
      });

      if (this.mode === 'update') {
        this.getEditionById(this.data.id, {});
      }
    });
  }

  getEditionById(id: number, data: any) {
    this.service.getEditionById(id, data).subscribe((res: any) => {
      this.editionForm.patchValue({
        ID: res.ID,
        EDITION_NAME: res.EDITION_NAME,
      });
      const selectedMenuIds = res.edition_menu.map((menu: any) => String(menu.MENU_ID));
      console.log('Selected Menu IDs:', selectedMenuIds);

      // Filter to find checked menus
      const checkedMenus = this.editionMenuList.filter((menu: any) => {
        const isSelected = selectedMenuIds.includes(String(menu.MENU_ID));
        console.log(
          'Checking menu ID:',
          `${menu.MENU_ID} against selected IDs. Is selected: ${isSelected}`
        );
        return isSelected;
      });

      console.log('Edition Menu List:', this.editionMenuList);
      console.log('Checked Menus:', checkedMenus);

      // Ensure selection is properly initialized
      if (this.selection && typeof this.selection.select === 'function') {
        // Select the checked menus in the selection model
        checkedMenus.forEach((menu: any) => this.selection.select(menu));
      } else {
        console.error('Selection model is not initialized or select method is not available');
      }
    });
  }

  onSubmit() {
    const editionMenu = this.editionForm.get('EDITION_MENU');

    if (editionMenu) {
      const selectedMenus = this.selection.selected;
      console.log('Selected menus:', selectedMenus);

      const postData: any = {
        ID: this.editionForm.value.ID,
        EDITION_NAME: this.editionForm.value.EDITION_NAME,
        EDITION_MENU: selectedMenus,
      };

      console.log('Form Data:', postData);

      if (this.editionForm.valid) {
        if (this.mode === 'add') {
          this.service.addEdition(postData).subscribe(
            (data: any) => {
              console.log('Edition added:', data);
              this.openEditionAddedDialog(
                'Edition',
                'Edition added successfully'
              );
              this.dialogRef.close('insert');
            },
            (error) => {
              console.error('Error adding edition:', error);
            }
          );
        } else {
          this.service.updateEdition(postData).subscribe(
            (data) => {
              console.log('Edition updated:', data);
              this.openEditionAddedDialog(
                'Edition',
                'Edition updated successfully'
              );
              this.dialogRef.close('update');
            },
            (error) => {
              console.error('Error updating edition:', error);
            }
          );
        }
      } else {
        console.log('Form is invalid');
      }
    } else {
      console.log('EditionMenu is not defined');
    }
  }

  openEditionAddedDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }

  // Whether the number of selected elements matches the total number of rows
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
