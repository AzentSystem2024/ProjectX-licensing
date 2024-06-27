import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { Getdata, MyserviceService } from '../myservice.service';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  constructor(private dialog: MatDialog,private dialogRef: MatDialogRef<AddUserDialogComponent>,public details:MyserviceService, private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
  }
  ngOnInit(): void {
    this.initForm();
  }

  show=true;
  submit=false;
  showPassword=false;

  Getdata!:Getdata[];

  id!:number;
  userName!:string;
  LOGIN_NAME!:string;
  password!:string;
  userLevel:number=0;
  levelName:string='';
  isInactive:boolean=false;

  

  

  options:any[]=[];
  filteredOptions:any;

  userLevels: { id: number, levelName: string }[] = [];

 

  initForm()
  {
    this.loadUserLevels();
    this.userForm.get('userlevel')?.valueChanges.subscribe(response=> {
      this.filterData(response);

    })
  }
  filterData(enteredData: any) {
    this.filteredOptions = this.userLevels.filter(item => {
      return item.levelName.toLowerCase().indexOf(enteredData.toLowerCase()) > -1 
    });
  }
  onSubmit(){

    this.submit=true;
    
    const selectedLevel = this.userLevels.find(level => level.levelName === this.levelName);
    if (selectedLevel) {

    var postData={
      USER_NAME:this.userName,
      LOGIN_NAME:this.LOGIN_NAME,
      PASSWORD:this.password,
      USER_LEVEL:selectedLevel.id,
      LEVEL_NAME:selectedLevel.levelName,
      Is_INACTIVE:this.isInactive

    }
 

   
    console.log('f',this.f)
    console.log('clicked',postData);

    // if(postData.LEVEL_NAME==='Admin')
    // {
    //   postData.USER_LEVEL=1;  
    // }
    // else if(postData.LEVEL_NAME==='User')
    // {
    //   postData.USER_LEVEL=2;
    // }
    // else if(postData.LEVEL_NAME==='Customer')
    // {
      
    //   postData.USER_LEVEL=3;
      
    // }

    if(this.userForm.valid){
      this.details.addUsers(postData).subscribe(
        (data:any)=>{ 
        console.log('working',data); 
        
        this.openUserAddedDialog("User Added", "User is added successfully");
        this.dialogRef.close('insert');
        },
      
      (err:any)=>{
        console.log(err);
      }
     );
    }

  }
  }



  openUserAddedDialog(title: string, message: string) {
    
    const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '300px',
        data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
        
        console.log('The dialog was closed');
    


    });
  }

  loadUserLevels(){
    this.details.getUserLevels().subscribe(
      (res:any)=>{
        console.log('userlevel is',res);
        this.userLevels=res;
      }
    )
  }
  



  userForm=this.fb.group({
    Username:['',Validators.required],
    Loginname:['',Validators.required],
    Password: ['', [Validators.required, Validators.minLength(8)]], 
    userlevel:[''],
   
  });

   get f(){    
    return this.userForm.controls;
  }
 
  toggleShow(){
    this.showPassword=!this.showPassword;
  }
  closeDialog(){
    this.dialogRef.close();
  }


  




}

