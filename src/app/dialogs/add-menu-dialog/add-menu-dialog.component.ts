import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { GetMenu, MyserviceService } from 'src/app/myservice.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  FormArray,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-menu-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatLabel,
    MatError,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './add-menu-dialog.component.html',
  styleUrl: './add-menu-dialog.component.scss',
})
export class AddMenuDialogComponent {
  submit = false;
  mode: 'add' | 'update' = 'add';
  loading = false;
  moduleList: any[] = [];
  menuGroupList: any[] = [];
  editData: any;
  selectedModuleDescription: string | null = null;
  errorMessage: string = '';
  menuOrderArray: any[] = [];
  menu!: GetMenu[];

  menuForm = this.fb.group({
    ID: [''],
    MODULE_NAME: ['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_GROUP: ['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_NAME: ['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_VERSION: ['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    REMARKS: ['', [ this.noWhitespaceOrSpecialChar]],
    MENU_KEY: ['', [Validators.required, this.checkDuplicateMenuKey.bind(this)]],
    MENU_ORDER: ['', [Validators.required, this.numberValidator.bind(this), this.checkDuplicateMenuKey.bind(this)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MyserviceService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMenuDialogComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMenu();
    this.mode = this.data?.mode || 'add';

    console.log('Data:', this.data); // Log the data object

    if (this.data && this.data.id) {
      // Check if data and id are defined
      console.log('ID:', this.data.id); // Log the id property
      this.service.getMenuById(this.data.id, {}).subscribe(
        (res: any) => {
          console.log('Response from getMenuById:', res);

          this.editData = res; // Assign the response directly to editData

          this.menuForm.patchValue({
            ID: this.editData.ID,
            MODULE_NAME: this.editData.MODULE_NAME,
            MENU_GROUP: this.editData.MENU_GROUP,
            MENU_NAME: this.editData.MENU_NAME,
            MENU_VERSION: this.editData.MENU_VERSION,
            REMARKS: this.editData.REMARKS,
            MENU_KEY: this.editData.MENU_KEY,
            MENU_ORDER: this.editData.MENU_ORDER,
          });
        },
        (error: any) => {
          console.error('Error fetching menu by ID:', error);
        }
      );
    } else {
      console.error('Data or ID is undefined:', this.data);
    }
    this.getModuleList();
    this.getMenuGroupList();
    this.onModuleChange();
  }

  get f() {
    return this.menuForm.controls;
  }

  get menuOrder() {
    return this.menuForm.get('MENU_ORDER');
  }

  getMenu() {
    this.service.getMenu().subscribe((data: any) => {
      this.menu = data;
      console.log(this.menu, 'menu list');
    });
  }

  checkDuplicateMenuKey(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
    if (formGroup && this.menu) {
      const currentItemId = formGroup.get('ID')?.value;
      const menuOrder = formGroup.get('MENU_ORDER')?.value;
  
      // Check for duplicate MENU_KEY
      const duplicateKeyExists = this.menu.some(item => {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.MENU_KEY === value;
      });
  
      // Check for duplicate MENU_ORDER
      const duplicateOrderExists = this.menu.some(item => {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.MENU_ORDER === menuOrder;
      });
  
      if (duplicateKeyExists) {
        return { duplicateMenuKey: true };
      }
      if (duplicateOrderExists) {
        return { duplicateMenuOrder: true };
      }
    }
    return null;
  }
  

  // checkDuplicateMenuKey(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value;
  //   const formGroup = control.parent as FormGroup;
  //   if (formGroup && this.menu) {
  //     const currentItemId = formGroup.get('ID')?.value;
  //     const duplicateExists = this.menu.some(item => {
  //       const isSameItem = item.ID === currentItemId;
  //       return !isSameItem && item.MENU_KEY === value;
  //     });
  
  //     if (duplicateExists) {
  //       return { duplicateMenuKey: true };
  //     }
  //   }
  //   return null;
  // }

  numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
  
    if (value && !/^-?\d*\.?\d+$/.test(value)) {
      return { invalidNumber: true }; // Validate if the value is a number
    }
  
    if (formGroup && this.menu) {
      const currentItemId = formGroup.get('ID')?.value;
      const currentOrderValue = parseFloat(value);
  
      const duplicateExists = this.menu.some(item => {
        const isSameItem = item.ID === currentItemId;
        const itemOrderValue = parseFloat(item.MENU_ORDER);
        return !isSameItem && itemOrderValue === currentOrderValue;
      });
  
      if (duplicateExists) {
        return { duplicateMenuOrder: true };
      }
    }
  
    return null;
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

  getModuleList() {
    this.service.getDropdownList().subscribe(
      (data: any) => {
        this.moduleList = data;
        console.log(this.moduleList, 'dropdown-modulesss');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getMenuGroupList() {
    this.service.getMenugroupDropdown().subscribe(
      (data: any) => {
        this.menuGroupList = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onModuleChange() {
    this.menuForm.get('MODULE_NAME')?.valueChanges.subscribe((value) => {
      const selectedModule = this.moduleList.find(
        (item) => item.DESCRIPTION === value
      );
      this.selectedModuleDescription = selectedModule
        ? selectedModule.DESCRIPTION
        : null;
    });
  }

  AddMenuDialogComponent(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }

  onSubmit() {
    this.submit = true;
    if (this.menuForm.invalid) {
      this.errorMessage = 'Form is invalid, please check the fields.';
      console.log('Form is invalid, cannot submit.');
      return;
    }
    const selectedModule = this.moduleList.find(
      (item) => item.DESCRIPTION === this.menuForm.value.MODULE_NAME
    );
    const selectedMenuGroup = this.menuGroupList.find(
      (item) => item.DESCRIPTION === this.menuForm.value.MENU_GROUP
    );

    if (selectedModule && selectedMenuGroup) {
      const postData: any = {
        MODULE_ID: selectedModule.ID,
        MENU_GROUP_ID: selectedMenuGroup.ID,
        MENU_NAME: this.menuForm.value.MENU_NAME,
        MENU_VERSION: this.menuForm.value.MENU_VERSION,
        REMARKS: this.menuForm.value.REMARKS,
        MENU_ORDER: this.menuForm.value.MENU_ORDER,
        MENU_KEY: this.menuForm.value.MENU_KEY,
      };

      if (this.menuForm.valid) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.closeDialog();
        }, 8000);

        if (this.menuForm.value.ID) {
          postData['ID'] = this.menuForm.value.ID;
          this.service.updateMenu(postData).subscribe(
            (data: any) => {
              this.openMenuDialog('Menu', 'Menu updated successfully');
              this.dialogRef.close('update');
            },
            (error: any) => {
              console.error('Error updating menu:', error);
            }
          );
        } else {
          this.service.addMenu(postData).subscribe(
            (data: any) => {
              this.openMenuDialog('Menu', 'Menu added successfully');
              this.dialogRef.close('insert');
            },
            (error: any) => {
              console.error('Error adding menu:', error);
            }
          );
        }
      }
    } else {
      if (!selectedModule) console.error('Selected module not found');
      if (!selectedMenuGroup) console.error('Selected menu group not found');
    }
  }

  openMenuDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }

  loadEditData(data: any) {
    this.menuForm.patchValue({
      ID: data.ID,
      MODULE_NAME: data.MODULE_NAME,
      MENU_GROUP: data.MENU_GROUP,
      MENU_NAME: data.MENU_NAME,
      MENU_VERSION: data.MENU_VERSION,
      REMARKS: data.REMARKS,
      MENU_KEY: data.MENU_KEY,
      MENU_ORDER: data.MENU_ORDER,
    });
    const selectedModule = this.moduleList.find(
      (item) => item.ID === data.MODULE_ID
    );
    this.selectedModuleDescription = selectedModule
      ? selectedModule.DESCRIPTION
      : null;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  decimalValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Handle empty or undefined values
      }

      // Regex to match positive or negative decimal numbers
      const isValid = /^-?\d*\.?\d+$/.test(control.value);

      if (!isValid) {
        return { invalidDecimal: true };
      }

      // Convert to float to normalize decimal format
      const numericValue = parseFloat(control.value);

      // Access the parent control to check for duplicates
      const formArray =
        (control.parent?.get('MENU_ORDER_ARRAY') as FormArray) || [];
      const duplicateExists = formArray.controls.some(
        (formControl: AbstractControl) => {
          const currentValue = parseFloat(formControl.value);
          return currentValue === numericValue;
        }
      );

      if (duplicateExists) {
        return { duplicateNumber: true };
      }

      return null; // Validation passed
    };
  }
}
