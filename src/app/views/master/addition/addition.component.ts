import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addition.component.html',
  styleUrl: './addition.component.scss'
})
export class AdditionComponent implements OnInit {

  ngOnInit(): void {
    
  }

}
