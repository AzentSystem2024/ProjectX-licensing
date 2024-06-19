import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MyserviceService } from 'src/app/myservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RenewLicenseDialogComponent } from '../renew-license-dialog/renew-license-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {SelectionModel} from '@angular/cdk/collections';
import {NoSelectionDialogComponent} from '../no-selection-dialog/no-selection-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';



@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatIconModule,MatTableModule,MatCardModule,MatTooltipModule,MatCheckboxModule,
    MatPaginatorModule,MatTabsModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.scss'
})
export class ViewCustomerComponent implements OnInit {

  facilityList:any;
  facilityCount:number=0;
  activeCount:number=0;
  inactiveCount:number=0;
  expiredCount:number=0;
  editionMenuList:any;
  @ViewChild('facilityPaginator') facilityPaginator!:MatPaginator;
  @ViewChild('menuPaginator') menuPaginator!:MatPaginator;
  
  customer: any[] = [
    {ID: 4, CUST_NAME: 'DILIGENZ SYSTEMS MIDDLE EAST',CUST_CODE:'123', CUSTOMER_KEY: 'XCTY-GHBG8-P8JHB', CONTACT_NAME: 'cust1', RESELLER_NAME: 'reseller1', COUNTRY_NAME: 'india'}
];
  displayedColumns: string[] = ['select','slno','facility-name','post-office','license','enrolledon','expiry-date','status'];
  displayedColumns1: string[] = ['select','slno','version','menu-group','menu-name','module','remarks'];
  dataSource: any;
  dataSource1:any;
  levelName:any;
  selectionFacility = new SelectionModel<any>(true, []);
  selectionMenu = new SelectionModel<any>(true, []);
  customerData:any;
  facilityData:any;
  saveButtonVisible: boolean = false;
  userId!:number;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dataservice:MyserviceService,
  private dialogRef: MatDialogRef<ViewCustomerComponent>,private dialog:MatDialog){
    this.levelName=dataservice.getlevelName();
    console.log('id',data.id);
    // dataservice.getEditionMenu().subscribe(data=>{
    //   this.editionMenuList = data;
    //   console.log('editionmenulist',this.editionMenuList)
      this.fetchMenuData();

      this.userId=dataservice.getUserId();
       

 

      

      // // Filter menus based on EDITION_NAME
      // const checkedMenus = this.editionMenuList.filter(
      //   (menu: any) => menu.EDITION_NAME === this.data.customer.EDITION_NAME
      // );

      // // Select the checked menus in the selection model
      // checkedMenus.forEach((menu: any) => this.selection.select(menu));
      
    
 
  }

  fetchMenuData(){
    this.dataservice.getCustomerView(this.data.id,{}).subscribe(data=>{
      this.customerData = data;
      console.log('customerview data',this.customerData);
      
      this.editionMenuList = data.MENU || [];       

      this.dataSource1 = new MatTableDataSource<any>(this.editionMenuList);
      this.dataSource1.paginator = this.menuPaginator;

      
      // Filter and disable checked menus
      const checkedMenus = this.editionMenuList.filter((menu: any) => {
      if (menu.IS_SELECTED === "true") {
          menu.disabled = true; // Disable the checked menu
          return true;
      }
      return false;
     });
    console.log('checkedmenu', checkedMenus);

    // Ensure unchecked menus are not disabled
     this.editionMenuList.forEach((menu: any) => {
      if (menu.IS_SELECTED !== "true") {
          menu.disabled = false;
      }
     });

  // Select the checked menus in the selection model
  checkedMenus.forEach((menu: any) => this.selectionMenu.select(menu));
      
     
    });
  
     
  }

  fetchAndFilterFacilityData() {
    
      this.dataservice.getCustomerView(this.data.id,{}).subscribe(data=>{
      this.facilityData=data.FACILITY;
      console.log('facility    data',this.facilityData);
      
      this.dataSource = new MatTableDataSource<any>(this.facilityData);
      this.dataSource.paginator = this.facilityPaginator;
      
    })
  }

  // Whether the number of selected elements matches the total number of rows 
  isAllSelected() {
    const numSelected = this.selectionFacility.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  isAllSelectedMenu() {
    const numSelected = this.selectionMenu.selected.filter(row => !row.disabled).length;
    const numRows = this.dataSource1.data.filter((row:any) => !row.disabled).length;
    return numSelected === numRows;
  }

  
  // Selects all rows if they are not all selected; otherwise clear selection
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selectionFacility.clear();
      return;
    }

    this.selectionFacility.select(...this.dataSource.data);
  }
  toggleMenuSelection(menu: any) {
    this.selectionMenu.toggle(menu);
    this.updateSaveButtonVisibility();
  }
  
  toggleAllRowsMenu() {
    if (this.isAllSelectedMenu()) {
        this.selectionMenu.selected
            .filter(row => !row.disabled)
            .forEach(row => this.selectionMenu.deselect(row));
    } else {
        this.dataSource1.data
            .filter((row:any) => !row.disabled)
            .forEach((row:any) => this.selectionMenu.select(row));
    }
    this.updateSaveButtonVisibility();
}
updateSaveButtonVisibility() {
if(this.selectionMenu.selected.length > 0){
  this.saveButtonVisible = true;
}
else{
  this.saveButtonVisible = false;
}
}

saveChanges() {
  const modifiedUserId = this.userId; // get user id from session
    const customerId = this.customerData.CUST_ID; 
    // Filter out duplicates from selectionMenu.selected
    const uniqueSelectedMenus = Array.from(new Set(this.selectionMenu.selected.map((menu: any) => menu.MENU_ID)))
    .map(menuId => this.selectionMenu.selected.find((menu: any) => menu.MENU_ID === menuId));

    const selectedMenus = uniqueSelectedMenus.map((menu: any) => ({
    MENU_ID: menu.MENU_ID,
    MODULE_ID: menu.MODULE_ID,
    MODULE_NAME: menu.MODULE_NAME,
    MENU_GROUP: menu.MENU_GROUP,
    MENU_NAME: menu.MENU_NAME,
    MENU_VERSION: menu.MENU_VERSION,
    REMARKS: menu.REMARKS,
    IS_SELECTED: "true", // Example: Assuming IS_SELECTED is always "true" based on your initial logic
    IS_WITH_EDITION: menu.IS_WITH_EDITION,
    MODIFIED_USER_ID: modifiedUserId,
    CUSTOMER_ID: customerId,
    }));

    const dataToSend = {
    CUSTOMER_ID: customerId,
    addon_test: selectedMenus,
    };

    console.log('Formatted selected menus:', dataToSend);

    this.dataservice.addCustomerMenu(dataToSend).subscribe(data=>{
      console.log("customer is inserted");
      this.openMenuAddedDialog("Menu", "Menu is added successfully");
      this.fetchMenuData();
      
    })
}

openMenuAddedDialog(title: string, message: string){
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    width: '300px',
    data: { title: title, message: message }
});
}

  renewLicense(){
    
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent,{
      width:'400px',
      height:'400px',
      data:{
        
      }

    });
  }
  renewAllLicenses() {
    if(this.selectionFacility.selected.length<1){
      this.dialog.open(NoSelectionDialogComponent, {
        width: '330px',
        height: '150px',
      });
      return;
    }

    //selected data
    const selectedFacilities = this.selectionFacility.selected;
    console.log('selected facilities',selectedFacilities);
    const dialogRef = this.dialog.open(RenewLicenseDialogComponent, {
      width: '400px',
      height: '280px',
      data: {
        facilities: selectedFacilities,
        mode:'renewAll'
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result==='insert') {
          this.fetchAndFilterFacilityData();
        }
      });
  }
  


  ngOnInit(): void {
    this.fetchAndFilterFacilityData();
    
  }
  closeDialog(){
    this.dialogRef.close();
  }

}
