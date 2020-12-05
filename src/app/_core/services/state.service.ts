import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from '../../_shared/models/user';
import { Role } from '../../_shared/models/role.enum';
import { TokenService } from './token.service';
import { AppInitializerService } from '../../app-initializer.service';
import { Year } from '../../_shared/models/years/year';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  currentUser: User;
  isGod: boolean;
  isAdmin: boolean;
  year: Year;
  pageTitle$: BehaviorSubject<string> = new BehaviorSubject('Results');

  constructor(private tokenService: TokenService,
              private appInitializerService: AppInitializerService) {
    this.year = this.appInitializerService.year;
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
    this.isGod = user?.role === Role.GOD;
    this.isAdmin = user?.role <= Role.ADMIN;
  }

}
