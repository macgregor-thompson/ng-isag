import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Login, LoginResponse } from '../../_shared/models/login';
import { StateService } from './state.service';
import { Role } from '../../_shared/models/role.enum';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { CreateUser } from '../../_shared/models/create-user';
import { User } from '../../_shared/models/user';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authApi = 'auth';
  redirectUrl: string;

  constructor(private http: HttpClient,
              private stateService: StateService,
              private router: Router,
              private spinnerService: SpinnerService) {
  }

  login(login: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/login`, login)
      .pipe(tap(resp => this.handleLogin(resp)));
  }

  @SpinnerAndCatchError
  signup(user: CreateUser): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/signup`, user)
      .pipe(tap(resp => this.handleLogin(resp)));
  }

  handleLogin(resp: LoginResponse): void {
    localStorage.setItem('user', JSON.stringify(resp.user));
    localStorage.setItem('ACCESS_TOKEN', resp.access_token);
    this.stateService.currentUser = resp.user;
    this.stateService.isAdmin = resp.user.role <= Role.ADMIN;
    this.router.navigateByUrl(this.redirectUrl || '');
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
