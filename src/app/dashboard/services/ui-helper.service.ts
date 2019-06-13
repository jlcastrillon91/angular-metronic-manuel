import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiHelperService {
  private linkCreationBtnNotifier$: Subject<any> = new Subject();

  createLinkBtnClicks$: Observable<
    any
  > = this.linkCreationBtnNotifier$.asObservable();

  constructor() {}

  notifyCreateLinkBtnClick() {
    this.linkCreationBtnNotifier$.next();
  }
}
