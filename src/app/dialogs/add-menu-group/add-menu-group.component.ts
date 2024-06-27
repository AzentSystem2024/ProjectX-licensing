import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
import { GetMenuGroup, MyserviceService } from 'src/app/myservice.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-menu-group',
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
  templateUrl: './add-menu-group.component.html',
  styleUrl: './add-menu-group.component.scss',
})
export class AddMenuGroupComponent {
  submit = false;
  mode: 'add' | 'update' = 'add';
  loading = false;
  enteredMenuOrders: number[] = [];
  existingMenuOrders: number[] = [];
  menuGroup!: GetMenuGroup[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MyserviceService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMenuGroupComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  filteredOptions: any;

  editData: any;
  errorMessage: string = '';
  menuGroupForm = this.fb.group({
    ID: [''],
    MENU_GROUP: ['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_KEY: ['', [Validators.required, this.checkDuplicateMenuKey.bind(this)]],
    MENU_ORDER: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),

        this.numberValidator.bind(this),
      ],
    ],
  });

  ngOnInit(): void {
    this.getMenuGroup();
    this.mode = this.data?.mode || 'add';

    if (this.data.id != '' && this.data.id != null) {
      this.service.getMenuGroupById(this.data.id, {}).subscribe((res) => {
        this.editData = res;
        console.log('byid', res);
        this.menuGroupForm.setValue({
          ID: this.editData.ID,
          MENU_GROUP: this.editData.MENU_GROUP,
          MENU_ORDER: this.editData.MENU_ORDER,
          MENU_KEY: this.editData.MENU_KEY,
        });
      });
    }
    this.service.getMenuGroup().subscribe((groups: any[]) => {
      this.existingMenuOrders = groups.map((group) => group.MENU_ORDER);
      console.log(this.existingMenuOrders, 'EXISTING MENU ORDERS');
    });
  }

  get f() {
    return this.menuGroupForm.controls;
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

  checkDuplicateMenuKey(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
    if (formGroup && this.menuGroup) {
      const currentItemId = formGroup.get('ID')?.value;
      const duplicateExists = this.menuGroup.some(item => {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.MENU_KEY === value;
      });
  
      if (duplicateExists) {
        return { duplicateMenuKey: true };
      }
    }
    return null;
  }

  numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
  
    if (value && !/^-?\d*\.?\d+$/.test(value)) {
      return { invalidNumber: true }; // Validate if the value is a number
    }
  
    if (formGroup && this.menuGroup) {
      const currentItemId = formGroup.get('ID')?.value;
      const currentOrderValue = parseFloat(value);
  
      const duplicateExists = this.menuGroup.some(item => {
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
  

//   numberValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     const formGroup = control.parent as FormGroup;

//     if (value && !/^-?\d*\.?\d+$/.test(value)) {
//         return { invalidNumber: true }; // Validate if the value is a number
//     }

//     if (formGroup && this.menuGroup) {
//         const currentOrderValue = parseFloat(value);

//         // Check for duplicates among MENU_ORDER values in existing menu items
//         const duplicateExists = this.menuGroup.some(item => {
//             const itemOrderValue = parseFloat(item.MENU_ORDER); // Access MENU_ORDER here
//             return itemOrderValue === currentOrderValue;
//         });

//         if (duplicateExists) {
//             return { duplicateMenuOrder: true };
//         }
//     }

//     return null;
// }

  openMenuGroupAddedDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message },
    });
  }

  getMenuGroup() {
    this.service.getMenuGroup().subscribe((data: any) => {
      this.menuGroup = data;
      console.log(data, 'menugrouppppppppppp');

    });
  }

  onSubmit() {
    console.log(this.menuGroupForm.value);

    this.submit = true;
    if (this.menuGroupForm.invalid) {
      this.errorMessage = 'Form is invalid, please check the fields.';
      console.log('Form is invalid, cannot submit.');
      return;
    }
    let postData: any = {
      MENU_GROUP: this.menuGroupForm.value.MENU_GROUP,
      MENU_ORDER: this.menuGroupForm.value.MENU_ORDER,
      MENU_KEY: this.menuGroupForm.value.MENU_KEY,
    };
    if (this.menuGroupForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      }, 8000);

      if (this.menuGroupForm.value.ID) {
        console.log(this.menuGroupForm.value.ID, 'menugroup id');
        postData['ID'] = this.menuGroupForm.value.ID;
        this.service.updateMenuGroup(postData).subscribe(
          (data: any) => {
            console.log(data, 'menugroup updateddddddddd');
            this.openMenuGroupAddedDialog(
              'Menugroup',
              'Menugroup updated successfully'
            );
            this.dialogRef.close('update');
          },
          (error: any) => {
            console.log(error, 'Error in updating');
          }
        );
      } else {
        this.service.addMenuGroup(postData).subscribe(
          (data: any) => {
            console.log(data, 'menu group added successfully');
            this.openMenuGroupAddedDialog(
              'Menugroup',
              'Menugroup added successfully'
            );
            this.dialogRef.close('insert');
          },
          (error: any) => {
            console.log(error, 'Error in adding menu group');
          }
        );
      }
    }
  }

  loadEditData(data: any) {
    this.menuGroupForm.patchValue({
      ID: data.ID,
      MENU_GROUP: data.MENU_GROUP,
      MENU_ORDER: data.MENU_ORDER,
      MENU_KEY: data.MENU_KEY,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
