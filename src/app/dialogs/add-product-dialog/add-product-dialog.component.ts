import { Component,OnInit,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { MyserviceService } from 'src/app/myservice.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule,MatLabel,MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatButtonModule,MatIconModule,MatFormFieldModule,MatLabel,MatError,MatInputModule],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent implements OnInit {
  submit=false;
  validmodule=false;
  IsEdit=false;
  ShowCode=false;
  editData:any;
  mode: 'add' | 'update' = 'add';
  PRODUCT_MODULE: Item[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private service:MyserviceService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddProductDialogComponent>, private fb:FormBuilder) {
  }
  
  productForm=this.fb.group({
    ID:[''],
    PRODUCT_CODE:[{ value: '', disabled: true }],
    PRODUCT_NAME:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    MODULE_NAME:['',this.noWhitespaceOrSpecialChar]
  });

  addModule() {
    const module = this.productForm.value['MODULE_NAME']?.trim(); // Trim the module name to remove leading/trailing spaces
    
    // Check if the module name is not empty
    if (module) {
      // Check if the module already exists in the PRODUCT_MODULE array based on MODULE_NAME
      const isDuplicate = this.PRODUCT_MODULE.some(item => item.MODULE_NAME.trim().toLowerCase() === module.toLowerCase());
      
      // If not a duplicate, add it to the PRODUCT_MODULE array
      if (!isDuplicate) {
        this.PRODUCT_MODULE.push({ MODULE_NAME: module, IS_DELETED: false });
        console.log("PRODUCT_MODULE after adding:", this.PRODUCT_MODULE);
        this.productForm.patchValue({ MODULE_NAME: '' });
      } else {
        console.log("Module already exists:", module);
      }
    }
  }

  onSubmit() {
    this.submit = true;
    var postData: any = {
      PRODUCT_NAME: this.productForm.value.PRODUCT_NAME,
    }
  
    if (this.productForm.valid) {
      if (this.productForm.value.ID) {
        
        postData['ID'] = this.productForm.value.ID;

        this.service.updateProduct(postData).subscribe(
          (data: any) => {
            console.log('Update Success:', data);
          

            this.openProductAddedDialog("Product", "Product updated successfully");
            this.dialogRef.close('update');
          },
          (error: any) => {
            console.error('Update Error:', error);
          }
        );
      } else {
        postData.product_module = this.PRODUCT_MODULE;
        this.service.addProduct(postData).subscribe(
          (data: any) => {
            console.log('working', data);
            this.openProductAddedDialog("Product", "Product added successfully");
            this.dialogRef.close('insert');
          },
          (error: any) => {
            console.error('API Error:', error);
          }
        );
      }
    }
  }
  
openProductAddedDialog(title: string, message: string){
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { title: title, message: message }
});
}


  ngOnInit(): void {
    this.mode = this.data?.mode || 'add'; 
    if(this.data.id!=''&&this.data.id!=null){
      this.ShowCode=true;
      this.service.getProductById(this.data.id).subscribe(res=>{
        this.editData=res;
        console.log('byid',this.editData);
        
        this.productForm.setValue({
          ID:this.editData.ID,
          PRODUCT_CODE:this.editData.PRODUCT_CODE,
          PRODUCT_NAME:this.editData.PRODUCT_NAME,
          MODULE_NAME:''
          

        });
        if (this.editData.product_module && this.editData.product_module.length > 0) {
          this.PRODUCT_MODULE = this.editData.product_module.map((module: any) => {
              return { MODULE_NAME: module.MODULE_NAME, IS_DELETED: module.IS_DELETED };
          });

          console.log("after load",this.PRODUCT_MODULE);
      }

      })
    }
    if (this.mode === 'update') {
      this.productForm.get('MODULE_NAME')?.clearValidators();
      // this.productForm.get('MODULE_NAME')?.updateValueAndValidity();
    }
  }
  

  closeDialog(){
    this.dialogRef.close();
  }
  get f(){    
    return this.productForm.controls;
  }
  deleteCompany(index: number) {
   
    this.PRODUCT_MODULE.splice(index, 1);
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
interface Item{

  MODULE_NAME:string;
  IS_DELETED:boolean;

}
