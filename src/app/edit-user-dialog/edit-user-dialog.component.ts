import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { result } from 'lodash-es';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  constructor(private dialog: MatDialog,private dialogRef: MatDialogRef<EditUserDialogComponent>,public servs:MyserviceService,private fb:FormBuilder, 
    private route:ActivatedRoute,private router:Router,@Inject (MAT_DIALOG_DATA) public data:any) {}

  show=true;
  submit=false;
  showPassword=false;
  selectedUser: any;


  editdata:any;

  options:any[]=[];
  level:any;
  filteredOptions:any;

  userForm=this.fb.group({
    ID:[''],
    USER_NAME:['', [Validators.required]],
    LOGIN_NAME:['', [Validators.required]],
    Password: ['', [Validators.required, Validators.minLength(8)]], 
    LEVEL_NAME:[''],
    IS_INACTIVE: [true],
    USER_LEVEL:[''],
  });

  initForm()
  {
    this.loadUserLevels();
    this.userForm.get('USER_LEVEL')?.valueChanges.subscribe(response=> {
      this.filterData(response);

    })
  }
  filterData(enteredData :any){
    this.filteredOptions=this.level.filter((item:any)=>{
      return item.toLowerCase().indexOf(enteredData.toLowerCase())>-1
    })

  }
  loadUserLevels(){
    this.servs.getUserLevels().subscribe(
      (res:any)=>{
        console.log(res);
        this.options=res;
        this.level = this.options.map((option: any) => option.LEVEL_NAME);
      }
    )
  }
  get f(){    
    return this.userForm.controls;
  }
  toggleShow(){
    this.showPassword=!this.showPassword;
  }
  closeDialog(){
    this.dialogRef.close();
  }

  UpdateUser(){
  
    this.submit = true;
    console.log(this.userForm.value)
    console.log('Update clicked', this.editdata.ID);

    if(this.editdata.LEVEL_NAME=='Admin')
    {
      this.editdata.USER_LEVEL=1;  
    }
    else if(this.editdata.LEVEL_NAME=='User')
    {
      this.editdata.USER_LEVEL=2;
    }
    
  
    if(this.userForm.valid){
      this.servs.updateUsers(this.userForm.value).subscribe(
        (result:any)=>{
          if(result){
            this.openUserEditedDialog("User Updated","User is Updated successfully");
            console.log(this.userForm.value);
            this.dialogRef.close('update');
          }
        },(result:any)=>{
          if(result){
            alert(result.error.message)
          }
        }
      )

    }
  }






  openUserEditedDialog(title: string, message: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '300px',
        data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
        
        console.log('The dialog was closed');
      


    });
}

  ngOnInit(): void {
    this.initForm();

    if(this.data.id!=''&&this.data.id!=null){
    //   this.servs.getUserById(this.data.id).subscribe(res=>{
    //     this.editdata=res;
    //     this.userForm.setValue({
    //       ID:this.editdata.ID,
    //       USER_NAME:this.editdata.USER_NAME,
    //       LOGIN_NAME:this.editdata.LOGIN_NAME,
    //       Password:this.editdata.PASSWORD,
    //       LEVEL_NAME: this.editdata.LEVEL_NAME,
    //       IS_INACTIVE: this.editdata.IS_INACTIVE,
    //       USER_LEVEL:this.editdata.USER_LEVEL,

         

    //     });
        

    //   })
    }
  }
  


}
