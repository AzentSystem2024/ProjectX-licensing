import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private sessionTimer: any;
  private sessionExpiredSubject = new Subject<void>();
  private sessionTimeRemainingSubject = new BehaviorSubject<number>(this.sessionTimeout);

  constructor() { }

  startSessionTimer() {
    this.sessionTimer = setInterval(() => {
      this.sessionTimeRemainingSubject.next(this.sessionTimeRemainingSubject.value - 1000);
      if (this.sessionTimeRemainingSubject.value <= 0) {
        this.stopSessionTimer();
        this.sessionExpiredSubject.next();
      }
    }, 1000);
  }

  stopSessionTimer() {
    clearInterval(this.sessionTimer);
  }

  getSessionExpired(): Observable<void> {
    return this.sessionExpiredSubject.asObservable();
  }

  getSessionTimeRemaining(): Observable<number> {
    return this.sessionTimeRemainingSubject.asObservable();
  }
}
