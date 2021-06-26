import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';    

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  public notifySubject = new BehaviorSubject<boolean>(true);
  public shared$ = this.notifySubject.asObservable();
  constructor() { }

  notifyParent() {
    this.notifySubject.next(true);
  }
}
