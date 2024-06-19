import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyserviceService } from 'src/app/myservice.service';
import { FormBuilder, ReactiveFormsModule,AbstractControl  } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule,MatLabel,MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [CommonModule,MatAutocompleteModule,
    MatButtonModule,ReactiveFormsModule,MatFormFieldModule,MatLabel,MatIconModule,MatError,MatInputModule,
    MatSelectModule],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {

  submit=false;
  loginNameExists: boolean = false;
  mode: 'add' | 'update' = 'add'; 
  disableLoginName=false;
  loading = false; // Loading flag
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddUserDialogComponent>, private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
  }

  userLevels: { id: number, description: string }[] = [];
  filteredOptions:any;
  editData:any;
  IS_INACTIVE=false;
  showPassword=false;
  showActive=false;
  
  userForm:any=this.fb.group({
    ID:[''],
    // RESELLER_CODE:['',Validators.required],
    USER_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    LOGIN_NAME: ['',[Validators.required, this.noWhitespaceOrSpecialChar]], 
    Password:['', [Validators.required, this.noWhitespaceOrSpecialChar]],
    userlevel:['',Validators.required],
    IS_INACTIVE: [false]
    
   
  });
  get f(){    
    return this.userForm.controls;
  }


  checkLoginName() {
    const loginName = this.userForm.value.LOGIN_NAME?.trim();
    if (loginName === '' || (this.mode === 'update' && loginName === this.editData.LOGIN_NAME)) {
      this.loginNameExists = false;
      this.addOrUpdateUser();
      return;
    }
  
    this.service.checkLoginNameExists(loginName).subscribe(
      (exists: boolean) => {
        this.loginNameExists = exists;
        console.log('Login name exists:', exists);
        if(exists){
          this.submit=false;
        }
        this.addOrUpdateUser(); 
      },
      (error: any) => {
        console.error('Error checking login name:', error);
      }
  );
  }

  
  onSubmit() {
    this.submit=true;
    // Trigger login name check
      this.checkLoginName();
  }

  addOrUpdateUser(){

      if (this.userForm.valid&& this.loginNameExists===false) {

        
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      }, 8000); // Simulate a delay of 2 seconds

        const selectedLevel = this.userLevels.find(item => item.description == this.userForm.value.userlevel);
        const postData:any = {
          USER_NAME: this.userForm.value.USER_NAME,
          LOGIN_NAME: this.userForm.value.LOGIN_NAME,
          PASSWORD: this.userForm.value.Password,
          USER_LEVEL: selectedLevel?.id,
          IS_INACTIVE: this.userForm.value.IS_INACTIVE
        };
  
        if (this.userForm.value.ID) {
          // Update existing user
          postData['ID'] = this.userForm.value.ID;
          this.service.updateUsers(postData).subscribe(
            (data: any) => {
              console.log('Update Success:', data);
              this.openUserAddedDialog("User", "User updated successfully");
              this.dialogRef.close('update');
            },
            (error: any) => {
              console.error('Update Error:', error);
            }
          );
        } else {
          // Add new user
          this.service.addUsers(postData).subscribe(
            (data: any) => {
              console.log('working', data);
              this.openUserAddedDialog("User", "User added successfully");
              this.dialogRef.close('insert');
            },
            (error: any) => {
              console.error('API Error:', error);
            }
          );
        }
      }
    
  }
  

  openUserAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  
  ngOnInit(): void {

    
    
    this.mode = this.data?.mode || 'add'; 
    this.loadUserLevels();
    
    if(this.data.id!=''&&this.data.id!=null){
      this.showActive=true;
      this.service.getUserById(this.data.id).subscribe(res=>{
        this.editData=res;
        console.log('byid',res);
        this.userForm.setValue({
          ID:this.editData.ID,
          
          USER_NAME:this.editData.USER_NAME,
          LOGIN_NAME:this.editData.LOGIN_NAME,
          Password: this.editData.PASSWORD,
          userlevel: this.editData.LEVEL_NAME,
          IS_INACTIVE:this.editData.IS_INACTIVE
        });
        

      })

      
    }
    
  }
  closeDialog(){
    this.dialogRef.close();
  }
  loadUserLevels(){
    this.service.getProjectXDropDownList('USERLEVEL').subscribe(
      (res:any)=>{
        console.log('userlevel is',res);
        this.userLevels=res;
      }
    )
  }

  toggleShow(){
    this.showPassword=!this.showPassword;
  }
  // Custom validator function to disallow leading white spaces and special characters
  noWhitespaceOrSpecialChar(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (value && (value.charAt(0) === ' ' || !/^[a-zA-Z0-9]/.test(value))) {
    return { 'invalidFormat': true };
  }
  return null;
}
  

}
