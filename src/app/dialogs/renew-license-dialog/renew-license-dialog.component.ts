import { Component, OnInit,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder,FormControl } from '@angular/forms';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA ,MatDialog,MatDialogRef} from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-renew-license-dialog',
  standalone: true,
  imports: [CommonModule,MatButtonModule,ReactiveFormsModule,MatLabel,MatInputModule],
  templateUrl: './renew-license-dialog.component.html',
  styleUrl: './renew-license-dialog.component.scss'
})
export class RenewLicenseDialogComponent implements OnInit {

  minDate: string;
  userId:any;

  facilities: Array<{ facility_id: number, new_expired_date: string, USER_ID: number }> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<RenewLicenseDialogComponent>,)
  {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.userId=service.getUserId();
  }
  
  renewForm:any=this.fb.group({
    
    NEW_EXPIRE_DATE:['']
  })

  

  ngOnInit(): void {
    this.facilities = this.data.facilities.map((facility: any) => ({
      facility_id: facility.ID,
    }));
  
    console.log('facilities', this.facilities);
  }
  
  onSubmit() {
    
    const newExpiryDateStr = this.renewForm.value.NEW_EXPIRE_DATE;
    const newExpiryDate= new Date(newExpiryDateStr);
    console.log('newexpdate',newExpiryDate)

    const formatDateToUTC = (date: Date) => {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds(),
      new Date().getUTCMilliseconds()));
      return utcDate.toISOString();
    };

      const postData = this.facilities.map(facility => ({
      facility_id: facility.facility_id,
      USER_ID: this.userId,
      new_expired_date: formatDateToUTC(newExpiryDate)
    }));

    console.log(postData);
    
  
      this.service.renewLicense(postData).subscribe(res => {
        console.log('license renew added', res);
        this.openLicenserenewalDialog("Renew", "License renewal done");
        this.dialogRef.close('insert');
      });
    
  }
  openLicenserenewalDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }
  closeDialog(){
    this.dialogRef.close();
  }
}
