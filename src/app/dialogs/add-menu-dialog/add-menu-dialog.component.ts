import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-menu-dialog',
  standalone: true,
  imports:[
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
  styleUrl: './add-menu-dialog.component.scss'
})
export class AddMenuDialogComponent {
  submit=false;
  mode: 'add' | 'update' = 'add'; 
  loading = false;
  moduleList : any[] = [];
  editData:any;

  menuForm=this.fb.group({
    ID:[''],
    MODULE_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_GROUP:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_VERSION:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    REMARKS:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddMenuDialogComponent>,
  private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
 }

 ngOnInit(){
  this.getModuleList();
 }

 get f(){    
  return this.menuForm.controls;
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
 getModuleList(){
  this.service.getDropdownList().subscribe((data:any) => {
    this.moduleList = data
    console.log(data,"dropdown-modulesss")


  },
  (error:any) => {
    console.log(error)
  }
)
}

AddMenuDialogComponent(title: string, message: string){
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { title: title, message: message }
});
}

onSubmit(){
  console.log(this.menuForm.value);
  
  this.submit=true;
  
  const selectedModule = this.moduleList.find(item => item.description == this.menuForm.value.MODULE_NAME);
  console.log('Selected Country ID:',selectedModule?.id);

  if(selectedModule)
  {
    console.log('Selected Country ID:', selectedModule.description);
  var postData:any={
    // RESELLER_CODE: this.resellerForm.value.RESELLER_CODE,
    MODULE_NAME: this.menuForm.value.MODULE_NAME,
    MENU_GROUP: this.menuForm.value.MENU_GROUP,
    MENU_NAME: this.menuForm.value.MENU_NAME,
    
    MENU_VERSION:this.menuForm.value.MENU_VERSION,
    REMARKS:this.menuForm.value.REMARKS 
  };

  if(this.menuForm.valid){

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.closeDialog();
    }, 8000); // Simulate a delay of 2 seconds

    if (this.menuForm.value.ID) {
      postData['ID']=this.menuForm.value.ID;
      this.service.updateReseller(postData).subscribe(
        (data: any) => { 
          console.log('Update Success:', data); 
          this.openMenuDialog("Reseller", "Reseller is updated successfully");
          this.dialogRef.close('update');
        },
        (error: any) => {
          console.error('Update Error:', error);
        }
      );

    }
    else{

  this.service.addResellers(postData).subscribe(
    (data:any)=>{ 
      console.log('working',data); 
      this.openMenuDialog("Reseller", "Reseller is added successfully");
      this.dialogRef.close('insert');
    },
    (error:any) => {
      console.error('API Error:', error);
    }
  );
    }
  }
}
}

openMenuDialog(title: string, message: string){
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { title: title, message: message }
});
}

loadEditData(data: any) {
  this.menuForm.patchValue({
    ID: data.ID,
    MENU_GROUP: data.MENU_GROUP
  });
}

closeDialog(){
  this.dialogRef.close();
}
}
