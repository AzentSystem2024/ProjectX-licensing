import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AddResellerDialogComponent } from './add-reseller-dialog/add-reseller-dialog.component';
import {AddCustomerDialogComponent} from './add-customer-dialog/add-customer-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AddFacilityComponent} from './add-facility/add-facility.component';
import {ViewCustomerComponent} from './view-customer/view-customer.component';
import {NoSelectionDialogComponent} from './no-selection-dialog/no-selection-dialog.component';
import { DefaultLayoutComponent } from '../containers';
import { AddMenuGroupComponent } from './add-menu-group/add-menu-group.component'



@NgModule({
  declarations: [
    DefaultLayoutComponent,
    AddResellerDialogComponent,
    AddCustomerDialogComponent,
    AddFacilityComponent,
    ViewCustomerComponent,
    NoSelectionDialogComponent,
    AddMenuGroupComponent
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    AddResellerDialogComponent,
    AddCustomerDialogComponent,
    AddMenuGroupComponent,
  ]
})
export class DialogModule {}