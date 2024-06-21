import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {SessionService} from 'src/services/session.service';


import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { MyserviceService } from 'src/app/myservice.service';
import { Subscription } from 'rxjs';

// @Pipe({
//   name: 'sessionTime'
// })
// export class SessionTimePipe implements PipeTransform {
//   transform(milliseconds: number): string {
//     const minutes: number = Math.floor(milliseconds / 60000);
//     const seconds: number = Math.floor((milliseconds % 60000) / 1000);
//     return `${minutes}m ${seconds}s`;
//   }
// }

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  loggedInUser: any;
  // sessionTimeRemaining!: number;
  // private sessionTimeSubscription!: Subscription;

    

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private session:SessionService,private classToggler: ClassToggleService,private service:MyserviceService,private router:Router) {
    super();
    this.loggedInUser = this.service.getLoggedInUser();  
    console.log('loggedinuser',this.loggedInUser);
  }
  Logout() {
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('userId');
    this.router.navigate(['/pages/login']); 
  }
  ngOnInit(): void {
    this.loggedInUser = this.service.getLoggedInUser();  
    // this.sessionTimeSubscription = this.session.getSessionTimeRemaining().subscribe(timeRemaining => {
    //   this.sessionTimeRemaining = timeRemaining;
    // });
    // this.session.startSessionTimer();
  }
  // ngOnDestroy() {
  //   this.sessionTimeSubscription.unsubscribe();
  // }
}
