import { Component } from '@angular/core';

import { resellerNavItems,navItems } from './_nav';
import { MyserviceService } from 'src/app/myservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = navItems;
  levelName:any;

  constructor(service:MyserviceService) {
    this.levelName=service.getlevelName();
    console.log('level name',this.levelName);
    if(this.levelName==='Reseller'){
      console.log(this.levelName);
      this.navItems=resellerNavItems;
    }
  }
}
