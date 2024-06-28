import { Component,Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder,FormsModule,ReactiveFormsModule,Validators,FormGroup,AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule,MatLabel,MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule,provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-add-customer-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,FormsModule,MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatSelectModule,MatTabsModule,ReactiveFormsModule,
    MatFormFieldModule,MatLabel,MatError,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './add-customer-dialog.component.html',
  styleUrl: './add-customer-dialog.component.scss'
})
export class AddCustomerDialogComponent {
  submit=false;
  ShowCode=false;
  customerlist:any;
  mode: 'add' | 'update' = 'add';
  loading = false; // Loading flag
  countrylist: { id: number, description: string }[] = [];
  resellerlist: { id: number, description: string }[] = [];
  emiratelist: { id: number, description: string }[] = [];
  editionlist: { id: number, description: string }[] = [];

  filteredOptions1:any;
  filteredOptions2:any;
  filteredOptions3:any;
  filteredOptions4:any;
  currentPage: number = 0;
  editData:any;
  userId:any;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private service:MyserviceService,private dialog: MatDialog,
  private dialogRef: MatDialogRef<AddCustomerDialogComponent>,) {
    this.userId=service.getUserId();
    console.log('userid',this.userId);
  }

  get f(){    
    return this.customerForm.controls;
  }

  customerForm:any=this.fb.group({
    ID:[''],
    CUST_CODE:[{ value: '', disabled: true }],
    CUST_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar,this.checkDuplicateCustomer.bind(this)]],
    CONTACT_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    RESELLER_NAME:[''],
    ADDRESS:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    EMAIL:['',[Validators.required,Validators.email,this.emailValidator]],
    PHONE:['',[Validators.required]],
    COUNTRY_NAME:['',Validators.required],
    EMIRATE:['',Validators.required],
    EDITION:['',Validators.required],
    ARCHIVE_DATE:['',Validators.required],
    START_YEAR:['',Validators.required],
    GENERATE_FIRST_XML:[false]
  });

  initCountryForm() {
    this.loadDropDownList('COUNTRY');
    this.customerForm.get('COUNTRY_NAME')?.valueChanges.subscribe((response:any) => {
      this.filterDataCountry(response);
      
    });
  }
  initStateForm() {
    this.loadDropDownList('EMIRATE');
    this.customerForm.get('EMIRATE')?.valueChanges.subscribe((response:any) => {
      this.filterDataEmirate(response);
      
    });
  }
  initResellerForm() {
    this.loadDropDownList('RESELLER');
    this.customerForm.get('RESELLER_NAME')?.valueChanges.subscribe((response:any) => {
      this.filterDataReseller(response);
      
    });
  }

  initEditionForm() {
    this.loadDropDownList('EDITION');
    this.customerForm.get('EDITION')?.valueChanges.subscribe((response:any) => {
      this.filterDataEdition(response);
      
    });
  }

  filterDataCountry(enteredData: any) {
  
      this.filteredOptions1 = this.countrylist.filter(item=> {
        return item.description.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
      });
    }
    filterDataEmirate(enteredData: any) {
  
      this.filteredOptions3 = this.emiratelist.filter(item=> {
        return item.description.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
      });
    }
    filterDataReseller(enteredData: any) {
      this.filteredOptions2 = this.resellerlist.filter(item => {
        return item.description.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
      });
    }
    filterDataEdition(enteredData: any) {
      this.filteredOptions4 = this.editionlist.filter(item => {
        return item.description.toLowerCase().indexOf(enteredData.toLowerCase()) > -1;
      });
    }
    
  onSubmit(){
    
    // Check form validity
    if (this.customerForm.invalid) {
    this.setInvalidTab(); // Switch to the tab containing the first invalid control
    return; // Prevent submission if form is invalid
   }
    
    this.submit=true;
    const selectedCountry = this.countrylist.find(item => item.description == this.customerForm.value.COUNTRY_NAME);
    const selectedReseller = this.resellerlist.find(item=> item.description== this.customerForm.value.RESELLER_NAME);
    const selectedEmirate = this.emiratelist.find(item => item.description == this.customerForm.value.EMIRATE);
    const selectedEdition = this.editionlist.find(item => item.description == this.customerForm.value.EDITION);

    


    
    // Function to pad numbers to ensure two digits
function padToTwoDigits(num: number): string {
  return num.toString().padStart(2, '0');
}

// Function to pad milliseconds to ensure three digits
function padToThreeDigits(num: number): string {
  return num.toString().padStart(3, '0');
}

// Formatting the date
const archiveDate = new Date(this.customerForm.value.ARCHIVE_DATE);

const formattedArchiveDate = `${archiveDate.getFullYear()}-${padToTwoDigits(archiveDate.getMonth() + 1)}-${padToTwoDigits(archiveDate.getDate())} ` +
                             `${padToTwoDigits(archiveDate.getHours())}:${padToTwoDigits(archiveDate.getMinutes())}:${padToTwoDigits(archiveDate.getSeconds())}.` +
                             `${padToThreeDigits(archiveDate.getMilliseconds())}`;

    if(selectedCountry){
      var postData:any={
        CUST_NAME:this.customerForm.value.CUST_NAME,
        CONTACT_NAME:this.customerForm.value.CONTACT_NAME,   
        ADDRESS:this.customerForm.value.ADDRESS,  
        COUNTRY_ID:selectedCountry.id,
        EMIRATE_ID:selectedEmirate ? selectedEmirate.id:null,
        CONTACT_PHONE:this.customerForm.value.PHONE,
        CONTACT_EMAIL:this.customerForm.value.EMAIL,
        RESELLER_ID: selectedReseller ? selectedReseller.id : null,
        EDITION_ID:selectedEdition? selectedEdition.id : null,
        LAST_MODIFIED_USER:this.userId,
        ARCHIVE_DATE:formattedArchiveDate,
        START_YEAR:this.customerForm.value.START_YEAR,
        GENERATE_FIRST_XML:this.customerForm.value.GENERATE_FIRST_XML,
      };
      console.log("postdata",postData);

      if(this.customerForm.valid){
        this.loading = true;
        setTimeout(() => {
          console.log('Form Submitted!', this.customerForm.value);
          this.loading = false;
          this.closeDialog();
        }, 8000); // Simulate a delay of 2 seconds

        if (this.customerForm.value.ID) {
          postData['ID']=this.customerForm.value.ID;
          this.service.updateCustomer(postData).subscribe(
            (data: any) => { 
              console.log('Update Success:', data); 
              this.openCustomerAddedDialog("Customer", "Customer updated successfully");
              this.dialogRef.close('update');
            },
            (error: any) => {
              console.error('Update Error:', error);
            }
          );
  
        }
        else{
      this.service.addCustomer(postData).subscribe(
        (data:any)=>{ 
          console.log('working',data); 
          this.openCustomerAddedDialog("customer", "Customer added successfully");
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
  openCustomerAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  ngOnInit(): void {
    this.mode = this.data?.mode || 'add'; 
    this.initCountryForm();
    this.initResellerForm();
    this.initStateForm();
    this.initEditionForm();
    this.getCustomerData();

    if(this.data.id!=''&&this.data.id!=null){
      this.ShowCode=true;
      this.service.getCustomerById(this.data.id,this.data.customer).subscribe(res=>{
        this.editData=res;
        console.log('byid',this.editData);
        
        this.customerForm.setValue({
          ID:this.editData.ID,
          CUST_CODE:this.editData.CUST_CODE,
          // RESELLER_CODE:this.editData.RESELLER_CODE,
          CUST_NAME:this.editData.CUST_NAME,
          CONTACT_NAME:this.editData.CONTACT_NAME,
          RESELLER_NAME:this.editData.RESELLER_NAME,
          ADDRESS: this.editData.ADDRESS,
          EMAIL: this.editData.CONTACT_EMAIL,
          PHONE:this.editData.CONTACT_PHONE,
          COUNTRY_NAME:this.editData.COUNTRY_NAME,
          EMIRATE:this.editData.EMIRATE,
          EDITION:this.editData.EDITION_NAME,
          ARCHIVE_DATE:this.editData.ARCHIVE_DATE,
          START_YEAR:this.editData.START_YEAR,
          GENERATE_FIRST_XML:this.editData.GENERATE_FIRST_XML
          
        });

      });
    }
    
    
  }

  closeDialog(){
    this.dialogRef.close();
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

  loadDropDownList(type: string){
    this.service.getProjectXDropDownList(type).subscribe(
      (res: any) => {
        console.log(`${type}s are`, res);
        if (type === 'COUNTRY') {
          this.countrylist = res;
        }if (type === 'RESELLER') {
          this.resellerlist = res.filter((reseller:any) => reseller.id !== '' && reseller.description !== ''); 
          console.log('reseller list',this.resellerlist);
        }
        if (type === 'EMIRATE') {
          this.emiratelist = res;
        }
        if (type === 'EDITION') {
          this.editionlist = res;
        }
        
      },
      (error: any) => {
        console.error(`Error loading ${type}s:`, error);
      }
    );
  }

  getCustomerData(){
    this.service.getCustomers().subscribe(
      (res:any) => {
        this.customerlist=res;
      },
      (error:any) => {
        console.error(error);
      }
    );
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

setInvalidTab(): void {
  const controls = this.customerForm.controls;

  // Check if Customer tab fields are valid
  if (
    controls['CUST_NAME'].invalid || 
    controls['CONTACT_NAME'].invalid || 
    controls['RESELLER_NAME'].invalid || 
    controls['ADDRESS'].invalid || 
    controls['EMAIL'].invalid || 
    controls['PHONE'].invalid || 
    controls['COUNTRY_NAME'].invalid || 
    controls['EMIRATE'].invalid || 
    controls['EDITION'].invalid
  ) {
    // Customer tab has errors, set currentPage to 0 (Customer tab)
    this.currentPage = 0;
  } else {
    // Customer tab is valid, move to Configuration tab
    this.currentPage = 1;
  }
}

checkDuplicateCustomer(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const formGroup = control.parent as FormGroup;
  if (formGroup && this.customerlist) {
    const currentItemId = formGroup.get('ID')?.value;
    const customerName = formGroup.get('CUST_NAME')?.value;
    // Check for duplicate MENU_KEY
    const duplicateCustomerExists = this.customerlist.some((item:any) => {
      const isSameItem = item.ID === currentItemId;
      return !isSameItem && item.CUST_NAME === customerName;
    });

    if (duplicateCustomerExists) {
      return { duplicateCustomer: true };
    }
 
  }
  return null;
}
}


