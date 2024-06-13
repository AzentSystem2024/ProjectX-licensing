import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MyserviceService } from 'src/app/myservice.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-menu-group',
  standalone: true,
  imports: [
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
  templateUrl: './add-menu-group.component.html',
  styleUrl: './add-menu-group.component.scss',
})
export class AddMenuGroupComponent {
  submit = false;
  mode: 'add' | 'update' = 'add';
  loading = false;
  enteredMenuOrders: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MyserviceService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMenuGroupComponent>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  filteredOptions: any;
  
  editData: any;

  menuGroupForm=this.fb.group({
    ID:[''],
    MENU_GROUP:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
    MENU_ORDER:['',[Validators.required, this.noWhitespaceOrSpecialChar]],
  })

  ngOnInit(): void {
    
    this.mode = this.data?.mode || 'add'; 
 
    if(this.data.id!=''&&this.data.id!=null){
      this.service.getMenuGroupById(this.data.id,{}).subscribe(res=>{
        this.editData=res;
        console.log('byid',res);
        this.menuGroupForm.setValue({
          ID:this.editData.ID,
          MENU_GROUP:this.editData.MENU_GROUP,
          MENU_ORDER : this.editData.MENU_ORDER
        });
        

      })
    }
  }
  
  get f(){    
    return this.menuGroupForm.controls;
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

  openMenuGroupAddedDialog(title: string, message: string){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { title: title, message: message }
  });
  }

  onSubmit(){
    console.log(this.menuGroupForm.value);
    
    this.submit=true;
    let postData : any = {
      MENU_GROUP : this.menuGroupForm.value.MENU_GROUP,
      MENU_ORDER : this.menuGroupForm.value.MENU_ORDER
    }
    if (this.menuGroupForm.valid){
      this.loading = true;setTimeout(() => {
        this.loading = false;
        this.closeDialog();
      },8000);

      if (this.menuGroupForm.value.ID){
        console.log(this.menuGroupForm.value.ID,"menugroup id")
        postData['ID'] = this.menuGroupForm.value.ID
        this.service.updateMenuGroup(postData).subscribe((data : any) => {
          console.log(data,"menugroup updateddddddddd")
          this.openMenuGroupAddedDialog("menugroup", "menugroup is updated successfully");
          this.dialogRef.close('update');
        },
        (error : any) =>{
          console.log(error,"Error in updating")
        }
      )

        }
        else {
          this.service.addMenuGroup(postData).subscribe((data : any) => {
            console.log(data, "menu group added successfully");
            this.openMenuGroupAddedDialog("menugroup", "menugroup is added successfully");
            this.dialogRef.close('insert');
          },
          (error : any) =>{
            console.log(error, "Error in adding menu group")
          }
        )
        }
      
    }
  }

  loadEditData(data: any) {
    this.menuGroupForm.patchValue({
      ID: data.ID,
      MENU_GROUP: data.MENU_GROUP,
      MENU_ORDER:data.MENU_ORDER
    });
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
