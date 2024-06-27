import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { GetModule, MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-module-dialog',
  standalone: true,
  imports:  [
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
  templateUrl: './add-module-dialog.component.html',
  styleUrl: './add-module-dialog.component.scss'
})
export class AddModuleDialogComponent {
  submit = false;
  mode: 'add' | 'update' = 'add';
  loading = false;
  module! : GetModule[]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MyserviceService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddModuleDialogComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  editData: any;

  moduleForm=this.fb.group({
    ID:[''],
    MODULE_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar, this.checkDuplicateModule.bind(this)]],
  })

  ngOnInit(): void {
    
    this.mode = this.data?.mode || 'add'; 
 
    if(this.data.id!=''&&this.data.id!=null){
      this.service.getModuleById(this.data.id,{}).subscribe(res=>{
        this.editData=res;
        console.log('byid',res);
        this.moduleForm.setValue({
          ID:this.editData.ID,
          MODULE_NAME:this.editData.MODULE_NAME,
        });
        

      })
    }
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

  openModuleAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  loadEditData(data: any) {
    this.moduleForm.patchValue({
      ID: data.ID,
      MODULE_NAME: data.MODULE_NAME
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onSubmit(){
    console.log(this.moduleForm.value);
    
    this.submit=true;
    let postData : any = {
      MODULE_NAME : this.moduleForm.value.MODULE_NAME
    }
    if (this.moduleForm.valid){
      this.loading = true;setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      },8000);

      if (this.moduleForm.value.ID){
        console.log(this.moduleForm.value.ID,"module id")
        postData['ID'] = this.moduleForm.value.ID
        this.service.updateModule(postData).subscribe((data : any) => {
          this.openModuleAddedDialog("module", "module is updated successfully");
          this.dialogRef.close('update');
        },
        (error : any) =>{
          console.log(error,"Error in updating")
        }
      )

        }
        else {
          this.service.addModule(postData).subscribe((data : any) => {
            console.log(data, "module added successfully");
            this.openModuleAddedDialog("module", "module is added successfully");
            this.dialogRef.close('insert');
          },
          (error : any) =>{
            console.log(error, "Error in adding module group")
          }
        )
        }
      
    }
  }

  checkDuplicateModule(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
    if (formGroup && this.module) {
      const currentItemId = formGroup.get('ID')?.value;
      const duplicateExists = this.module.some(item => {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.MODULE_NAME === value;
      });
      if (duplicateExists) {
        return { duplicateModule: true };
      }
    }
    return null;
  }

  get f(){    
    return this.moduleForm.controls;
  }

}
