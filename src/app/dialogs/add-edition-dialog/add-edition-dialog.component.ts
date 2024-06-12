import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MyserviceService } from 'src/app/myservice.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-edition-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,MatInputModule,
    MatAutocompleteModule,MatButtonModule,MatSelectModule,ReactiveFormsModule,MatFormFieldModule,
    MatLabel,MatError,MatCheckboxModule,MatPaginatorModule,MatTableModule,MatCardModule],
  templateUrl: './add-edition-dialog.component.html',
  styleUrl: './add-edition-dialog.component.scss'
})
export class AddEditionDialogComponent {

  
}
