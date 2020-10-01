import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from '../../_shared/models/user';
import { Role } from '../../_shared/models/role.enum';
import { TokenService } from './token.service';
import { AppInitializerService } from '../../app-initializer.service';
import { Year } from '../../_shared/models/year';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  currentUser: User;
  isAdmin: boolean;
  currentYear: Year;
  pageTitle$: BehaviorSubject<string> = new BehaviorSubject('Results');

  richTextModules = {
    toolbar: {
      container: [
        [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }], ['bold', 'italic', 'underline', 'strike', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }], [{ 'color': [] }, { 'background': [] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }], ['link']
      ]
    },
   /* embedBlocker: {
      notifyService: this.notifyService
    }*/
  };

  constructor(private tokenService: TokenService,
              private appInitializerService: AppInitializerService) {
    this.currentYear = this.appInitializerService.year;
    if (this.tokenService.tokenHasNotExpired()) {
      this.initCurrentUser(JSON.parse(localStorage.getItem('user')));
    }
  }

  onRouteChange(data) {
    if (data.hasOwnProperty('title')) this.setTitle(data.title);
  }

  setTitle(title): void {
    this.pageTitle$.next(title || '');
    document.title = `${title} | iSag`;
  }

  initCurrentUser(user: User): void {
    this.currentUser = user;
    this.isAdmin = user?.role <= Role.ADMIN;
  }

}
