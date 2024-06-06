import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-no-selection-dialog',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl: './no-selection-dialog.component.html',
  styleUrl: './no-selection-dialog.component.scss'
})
export class NoSelectionDialogComponent {
  constructor(private dialogRef: MatDialogRef<NoSelectionDialogComponent>,){}
  closeDialog(){
    this.dialogRef.close();
  }
}
