import { Injectable } from '@angular/core';
import {MyserviceService} from 'src/app/myservice.service';
import { CanActivateFn,Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private service: MyserviceService, private router: Router) {}

  canActivate(): boolean {
    if (this.service.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['pages/login']); // Redirect to login page
      return false;
    }
  }

}
