import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Login, LoginResponse } from '../../_shared/models/login';
import { StateService } from './state.service';
import { Router } from '@angular/router';
import { Role } from '../../_shared/models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApi = 'auth';
  redirectUrl: string;

  constructor(private http: HttpClient,
              private stateService: StateService,
              private router: Router) {
  }

  login(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/login`, login)
      .pipe(
        tap(resp => {
          localStorage.setItem('user', JSON.stringify(resp.user));
          localStorage.setItem('ACCESS_TOKEN', resp.access_token);
          this.stateService.currentUser = resp.user;
          this.stateService.isAdmin = resp.user.role <= Role.admin;
          this.router.navigateByUrl(this.redirectUrl || '');
        }));
  }

  logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('user');
    this.stateService.currentUser = null;
    this.stateService.isAdmin = false;
   // window.location.reload();
  }

  loginOrSignUp(url: '/login' | '/signup'): void {
    this.redirectUrl = this.router.url;
    this.router.navigate([url]);
  }

}
