import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyserviceService } from 'src/app/myservice.service';
import { FormBuilder, ReactiveFormsModule,AbstractControl, ValidationErrors } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-reseller-dialog',
  standalone: true,

  
  imports: [CommonModule,ReactiveFormsModule,MatAutocompleteModule,
    MatButtonModule,ReactiveFormsModule,MatFormFieldModule,MatLabel,MatError,MatInputModule,MatSelectModule,MatIconModule
  ],
  templateUrl: './add-reseller-dialog.component.html',
  styleUrl: './add-reseller-dialog.component.scss'
})
export class AddResellerDialogComponent {
  submit=false;
  reseller:any;
  mode: 'add' | 'update' = 'add'; 
  loading = false; // Loading flag
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddResellerDialogComponent>,
   private fb:FormBuilder, private route:ActivatedRoute,private router:Router) {
  }

  countrylist: { id: number, description: string }[] = [];
  filteredOptions:any;
  countryName:any;
  editData:any;
  showPassword=false;
  
  resellerForm=this.fb.group({
    ID:[''],
    // RESELLER_CODE:['',Validators.required],
    RESELLER_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar,this.checkDuplicateReseller.bind(this)]],
    RESELLER_PHONE:['',[Validators.required]],
    RESELLER_EMAIL:['',[Validators.required,Validators.email,this.emailValidator]],
    COUNTRY_NAME:['',Validators.required],
    LOGIN_NAME:['',[Validators.required,this.checkDuplicateReseller.bind(this)]],
    PASSWORD:['',Validators.required]
  });
  
  get f(){    
    return this.resellerForm.controls;
  }
  keyPressNumbers(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  initForm()
  {
    this.loadCountryList();
    this.resellerForm.get('COUNTRY_NAME')?.valueChanges.subscribe(response=> {
      this.filterData(response);

    })
  }
  filterData(enteredData: any) {
    this.filteredOptions = this.countrylist.filter(item => {
      return item.description.toLowerCase().indexOf(enteredData.toLowerCase()) > -1 
    });
  }
  
  onSubmit(){
    console.log(this.resellerForm.value);
    
    this.submit=true;
    
    const selectedCountry = this.countrylist.find(item => item.description == this.resellerForm.value.COUNTRY_NAME);
    console.log('Selected Country ID:',selectedCountry?.id);
 
    if(selectedCountry)
    {
      console.log('Selected Country ID:', selectedCountry.description);
    var postData:any={
      // RESELLER_CODE: this.resellerForm.value.RESELLER_CODE,
      RESELLER_NAME: this.resellerForm.value.RESELLER_NAME,
      RESELLER_PHONE: this.resellerForm.value.RESELLER_PHONE,
      RESELLER_EMAIL: this.resellerForm.value.RESELLER_EMAIL,
      COUNTRY_ID:selectedCountry.id, 
      LOGIN_NAME:this.resellerForm.value.LOGIN_NAME,
      PASSWORD:this.resellerForm.value.PASSWORD 
    };

    if(this.resellerForm.valid){

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      }, 8000); // Simulate a delay of 2 seconds

      if (this.resellerForm.value.ID) {
        postData['ID']=this.resellerForm.value.ID;
        this.service.updateReseller(postData).subscribe(
          (data: any) => { 
            console.log('Update Success:', data); 
            this.openResellerAddedDialog("Reseller", "Reseller is updated successfully");
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
        this.openResellerAddedDialog("Reseller", "Reseller is added successfully");
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

  openResellerAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  
  ngOnInit(): void {
    
    this.mode = this.data?.mode || 'add'; 
    this.initForm();
    this.getReseller();
    if(this.data.id!=''&&this.data.id!=null){
      this.service.getResellerById(this.data.id,{}).subscribe(res=>{
        this.editData=res;
        console.log('byid',res);
        this.resellerForm.setValue({
          ID:this.editData.ID,
          // RESELLER_CODE:this.editData.RESELLER_CODE,
          RESELLER_NAME:this.editData.RESELLER_NAME,
          RESELLER_PHONE:this.editData.RESELLER_PHONE,
          RESELLER_EMAIL: this.editData.RESELLER_EMAIL,
          COUNTRY_NAME: this.editData.COUNTRY_NAME,
          LOGIN_NAME:this.editData.LOGIN_NAME,
          PASSWORD:this.editData.PASSWORD
        });
        

      })
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }
  loadCountryList(){
    this.service.getDropDownList('COUNTRY').subscribe(
      (res:any)=>{
        console.log('Countries are',res);
        this.countrylist=res;
      }
    )
  }

  getReseller() {
    this.service.getResellers().subscribe((data: any) => {
      this.reseller = data;
      console.log(data, 'reseller');
      // this.resellerForm.get('RESELLER_NAME')?.updateValueAndValidity();
      // this.resellerForm.get('LOGIN_NAME')?.updateValueAndValidity();
    });
  }

  checkDuplicateReseller(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const formGroup = control.parent as FormGroup;
    if (formGroup && this.reseller) {
      const currentItemId = formGroup.get('ID')?.value;

      //duplicate resellername
      const duplicateExists = this.reseller.some((item:any )=> {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.RESELLER_NAME === value;
      });
       //check login name
       const duplicateLoginNameExists = this.reseller.some((item:any )=> {
        const isSameItem = item.ID === currentItemId;
        return !isSameItem && item.LOGIN_NAME === value;
      });
      if (duplicateExists) {
        return { duplicateReseller: true };
      }
      if (duplicateLoginNameExists) {
        return { duplicateLoginName: true };
      }
    }
    return null;
  }


  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const email: string = control.value;
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return { 'invalidEmail': true };
    }
    return null;
}
   // Custom validator function to disallow leading white spaces and special characters
   noWhitespaceOrSpecialChar(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (value.charAt(0) === ' ' || !/^[a-zA-Z0-9]/.test(value))) {
      return { 'invalidFormat': true };
    }
    return null;
  }

  toggleShow(){
    this.showPassword=!this.showPassword;
  }
}
