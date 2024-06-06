import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GetModule, MyserviceService } from 'src/app/myservice.service';

@Component({
  selector: 'app-module',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './module.component.html',
  styleUrl: './module.component.scss'
})
export class ModuleComponent implements OnInit{
  displayedColumns: string[] = [ 'slNo','Menu Group', 'Action'];
  moduleList!: GetModule[];
  dataSource: any;

  constructor(public service: MyserviceService){}

  @ViewChild(MatPaginator) paginatior!: MatPaginator;

  @ViewChild(MatSort) sortt!: MatSort;

  ngOnInit(): void {
    this.getModule()
  }

  getModule() {
    this.service.getModule().subscribe((data: any) => {
      this.moduleList = data;
      console.log(data, 'modulesssssss');
      this.dataSource = new MatTableDataSource<GetModule>(this.moduleList);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sortt;
    });
  }

  openModulePopup(){

  }

  Filterchange(data : Event){

  }

}