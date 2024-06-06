import { Component, OnInit,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder,FormsModule,ReactiveFormsModule,Validators,FormGroup,AbstractControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatLabel,MatError } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-add-license-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,
    MatAutocompleteModule,MatButtonModule,MatSelectModule,ReactiveFormsModule,MatLabel,MatError,MatInputModule],
  templateUrl: './add-license-dialog.component.html',
  styleUrl: './add-license-dialog.component.scss'
})
export class AddLicenseDialogComponent implements OnInit {

  customerList:{ id: number, description: string }[] = [];
  companyList:any;
  productList:{ id: number, description: string }[] = [];
  licensetype:{ id: number, description: string }[] = [];
  mode: 'add' | 'update'|'view' = 'add';
  selectcompany:any;
  editData:any;
  userid!:number;
  


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddLicenseDialogComponent>,) {}

  
  licenseForm=this.fb.group({
    ID:[''],
    CUST_NAME:['',Validators.required],
    COMPANY_NAME:['',Validators.required],
    PRODUCT_NAME:['',Validators.required],
    TYPE_NAME:['',Validators.required],
    VALID_DAYS:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
});


logChangeEvent() {
  console.log('Change event triggered');
}

SelectCompanyByCustomer() {
  const selectedCustomerName = this.licenseForm.get('CUST_NAME')?.value;

 
  const selectedCustomer = this.customerList.find(customer => customer.description === selectedCustomerName);

  if (selectedCustomer) {
   
      const selectedCustomerId = selectedCustomer.id;

      
      this.selectcompany = this.companyList.filter((company:any) => company.PARENT_ID === selectedCustomerId);
  } else {
      
      this.selectcompany = [];
  }
}

  onSubmit(){
    const selectedCustomer = this.customerList.find(item => item.description == this.licenseForm.value.CUST_NAME);
    const selectedCompany = this.selectcompany.find((item:any) => item.DESCRIPTION == this.licenseForm.value.COMPANY_NAME);
    const selectedProduct = this.productList.find((item:any)=> item.description== this.licenseForm.value.PRODUCT_NAME);
    const selectedType = this.licensetype.find((item:any)=> item.description== this.licenseForm.value.TYPE_NAME);

    var postData:any={
      USER_ID:this.userid,
      CUST_ID:selectedCustomer?.id,
      COMPANY_ID: selectedCompany ? selectedCompany.ID : null, // Assign null if selectedCompany is null
      PRODUCT_ID:selectedProduct?.id,
      LICENSETYPE_ID:selectedType?.id,
      VALID_DAYS:this.licenseForm.value.VALID_DAYS,
    }
    console.log('postdata',postData);

    if(this.licenseForm.valid){

    if (this.licenseForm.value.ID) {
      postData['ID']=this.licenseForm.value.ID;
      this.service.updateLicense(postData).subscribe(
        (data: any) => { 
          console.log('Update Success:', data); 
          this.dialogRef.close('update');
          this.openLicenseAddedDialog("License", "License updated successfully");
        },
        (error: any) => {
          console.error('Update Error:', error);
        }
      );

    }
    else {
    this.service.addLicense(postData).subscribe(
      (data:any)=>{
        console.log('inserted license',data);
        this.openLicenseAddedDialog("License", "License added successfully");
        this.dialogRef.close('insert');
      },
      (error:any) => {
        console.error('API Error:', error);
      }
    );
    }
  }
  }
  openLicenseAddedDialog(title: string, message: string){
    const dialogReff = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  getLicenseById(){
    if(this.data.id!=''&&this.data.id!=null){
      
      this.service.getLicenseById(this.data.id).subscribe(res=>{
        this.editData=res;
        console.log('byid',this.editData);

        console.log('COMPANY_NAME:', this.editData.COMPANY_NAME);
        
        this.licenseForm.setValue({
          ID:this.editData.ID,
          CUST_NAME:this.editData.CUST_NAME,
          COMPANY_NAME:this.editData.COMPANY_NAME,
          PRODUCT_NAME:this.editData.PRODUCT_NAME,
          TYPE_NAME:this.editData.TYPE_NAME,
          VALID_DAYS:this.editData.VALID_DAYS,
          

        });
        //mannually trigger company list 
        this.SelectCompanyByCustomer();

        console.log('licenseform',this.licenseForm.value);

        // if(this.mode==='view'){
        //   this.licenseForm.disable();
        // }

      })
    }
  }

  





  ngOnInit(): void {
    this.userid=this.service.getUserId();
    this.mode = this.data?.mode || 'add'; 
    this.loadDropDownList('PRODUCT');
    this.loadDropDownList('CUSTOMER');
    this.loadDropDownList('LICENSETYPE');
    this.loadSelectDropDownList('COMPANY');
    this.getLicenseById();

    this.licenseForm.get('CUST_NAME')?.valueChanges.subscribe(value => {
      console.log('CUST_NAME value:', value);
  });

  }

  closeDialog(){
    this.dialogRef.close();
  }
  loadDropDownList(type: string){
    this.service.getDropDownList(type).subscribe(
      (res: any) => {
        console.log(`${type}s are`, res);
       if (type === 'CUSTOMER') {
          this.customerList = res; 
          console.log('Customer list',this.customerList);
        }
        else if (type === 'PRODUCT') {
          
          this.productList = res.filter((product:any) => product.id !== '' && product.description !== ''); 
          console.log('product list',this.productList);
        }
        else if (type === 'LICENSETYPE') {
          this.licensetype = res; 
          console.log('type list',this.licensetype);
        }
      },
      (error: any) => {
        console.error(`Error loading ${type}s:`, error);
      }
    );
  }
  loadSelectDropDownList(type:string){
    this.service.getSelectDropDown(type).subscribe(
      (res:any)=> {
        if(type === 'COMPANY'){
          this.companyList=res;
          console.log('company list',res);
        }
      }
    )
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
  // Custom validator function to disallow leading white spaces and special characters
  noWhitespaceOrSpecialChar(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && (value.charAt(0) === ' ' || !/^[a-zA-Z0-9]/.test(value))) {
      return { 'invalidFormat': true };
    }
    return null;
  }
}
