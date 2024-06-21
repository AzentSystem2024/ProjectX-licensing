import { Component,Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder,FormsModule,ReactiveFormsModule,Validators,FormGroup,AbstractControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule,MatLabel,MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { RenewLicenseDialogComponent } from '../renew-license-dialog/renew-license-dialog.component';



@Component({
  selector: 'app-add-facility',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,FormsModule,MatInputModule,MatSnackBarModule,
    MatAutocompleteModule,MatButtonModule,MatSelectModule,MatTabsModule,MatTooltipModule,
    ReactiveFormsModule,MatFormFieldModule,MatLabel,MatError,MatDatepickerModule,MatNativeDateModule,MatIconModule],
  templateUrl: './add-facility.component.html',
  styleUrl: './add-facility.component.scss'
})
export class AddFacilityComponent implements OnInit {

  customer:any;
  emirate:any;
  postoffice: any;
  mode: 'add' | 'update' = 'add';
  loading = false; // Loading flag
  userid: any;
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  existingFacilities: any;
  editData: any;

  facilityForm:any=this.fb.group({
    ID:[''],
    CUSTOMER_ID:['',[Validators.required]],
    FACILITY_LICENSE:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    FACILITY_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    ADDRESS:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    EMIRATE_ID:['',Validators.required],
    POST_OFFICE:['',Validators.required],
    START_DATE:['',Validators.required],
    EXPIRY_DATE:['',Validators.required],
    AMC_EXPIRY_DATE:['',Validators.required]
  });
  
  
 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private service:MyserviceService,
  private dialog: MatDialog,private snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<AddFacilityComponent>,){
    this.existingFacilities = data.existingFacilities || [];
    service.getCustomers().subscribe(data=>{
      this.customer=data.filter((item:any) => item.CUST_NAME);
    })
    service.getProjectXDropDownList('EMIRATE').subscribe(data=>{
      this.emirate=data;
    })
    service.getProjectXDropDownList('POSTOFFICE').subscribe(data=>{
      this.postoffice=data;
    })
  }

  onSubmit(){

    const selectedCustomer = this.customer.find((item:any) => item.CUST_NAME == this.facilityForm.value.CUSTOMER_ID);
    const selectedEmirate = this.emirate.find((item:any) => item.description == this.facilityForm.value.EMIRATE_ID);

    const facilityLicense:any = this.facilityForm.value.FACILITY_LICENSE;
    const postOffice:any = this.facilityForm.value.POST_OFFICE;
  
    
    if (this.isDuplicateLicense(facilityLicense, postOffice)) {
      this.snackBar.open('This Facility License already exists..!', 'Close', {
        duration: 3000,
        horizontalPosition:'right'
      });
      return;
    }

    const formatDateToUTC = (date: Date) => {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      return utcDate.toISOString();
    };

    var postData:any={
      CUSTOMER_ID:selectedCustomer.ID,
      FACILITY_LICENSE:this.facilityForm.value.FACILITY_LICENSE,
      FACILITY_NAME:this.facilityForm.value.FACILITY_NAME,
      ADDRESS:this.facilityForm.value.ADDRESS,
      EMIRATE_ID:selectedEmirate.id,
      POST_OFFICE:this.facilityForm.value.POST_OFFICE,
      IS_INACTIVE:false,
      ENROLL_DATE:formatDateToUTC(new Date(this.facilityForm.value.START_DATE)),
      EXPIRY_DATE:formatDateToUTC(new Date(this.facilityForm.value.EXPIRY_DATE)),
      AMC_EXPIRY_DATE:formatDateToUTC(new Date(this.facilityForm.value.AMC_EXPIRY_DATE)),
      USER_ID:this.userid
      
    }
    console.log('check post data',postData);
    if(this.facilityForm.valid){

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      }, 8000); // Simulate a delay of 2 seconds

      if (this.facilityForm.value.ID) {
        postData['ID']=this.facilityForm.value.ID;
        this.service.updateFacility(postData).subscribe(
          (data: any) => { 
            console.log('Update Success:', data); 
            this.openFacilityAddedDialog("Facility", "Facility updated successfully");
            this.dialogRef.close('update');
          },
          (error: any) => {
            console.error('Update Error:', error);
          }
        );

      }
      else{
    this.service.addFacility(postData).subscribe((data:any)=>{
          console.log('working',data); 
          this.openFacilityAddedDialog("Facility", "Facility added successfully");
          this.dialogRef.close('insert');
        },
        (error:any) => {
          console.error('API Error:', error);
        }
      );
    }
  }
 
  }
  openFacilityAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  renewLicense(data:any){
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent,{
      width:'400px',
      height:'400px',
      data:{
        
      }

    });
  }

  closeDialog(){
    this.dialogRef.close();
  }
  //check the facility license is already exist or not
  isDuplicateLicense(facilityLicense: string, postOffice: string): boolean {
    return this.existingFacilities.some((facility:any) =>
      facility.FACILITY_LICENSE === facilityLicense && facility.POST_OFFICE === postOffice
    );
  }
  ngOnInit(): void {
    this.userid=this.service.getUserId();
    this.mode = this.data?.mode || 'add'; 
    console.log('mode',this.mode)

    if(this.data.id!=''&&this.data.id!=null){
      this.service.getFacilityById(this.data.id,this.data.facility).subscribe(res=>{
        this.editData=res;
        console.log('byid',this.editData);
        this.facilityForm.setValue({
          ID:this.editData.ID,
          CUSTOMER_ID:this.editData.CUST_NAME,
          FACILITY_LICENSE:this.editData.FACILITY_LICENSE,
          FACILITY_NAME:this.editData.FACILITY_NAME,
          ADDRESS:this.editData.ADDRESS,
          EMIRATE_ID:this.editData.EMIRATE,
          POST_OFFICE:this.editData.POST_OFFICE,
          START_DATE:this.formatDateFromUTC(this.editData.ENROLL_DATE),
          EXPIRY_DATE:this.formatDateFromUTC(this.editData.EXPIRY_DATE),
          AMC_EXPIRY_DATE:this.formatDateFromUTC(this.editData.AMC_EXPIRY_DATE),

        });

        if (this.mode === 'update') {
          this.facilityForm.get('START_DATE').disable();
          this.facilityForm.get('EXPIRY_DATE').disable();
          this.facilityForm.get('AMC_EXPIRY_DATE').disable();
        }

      });
    }
    
  }
  //view date in standard format
  formatDateFromUTC(dateString: string): Date {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
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
