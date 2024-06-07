import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  submit=false;
  mode: 'add' | 'update' = 'add';
  loading = false;
  menuGroupForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddMenuGroupComponent>,
  private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
    this.menuGroupForm = this.fb.group({
      ID: [''],
      MENUGROUP: ['', [Validators.required, this.noWhitespaceOrSpecialChar]]
    });
 }
 
 filteredOptions:any;
 menuGroupName : any;
 editData : any;



 noWhitespaceOrSpecialChar(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (value && (value.charAt(0) === ' ' || !/^[a-zA-Z0-9]/.test(value))) {
    return { 'invalidFormat': true };
  }
  return null;
}

}
