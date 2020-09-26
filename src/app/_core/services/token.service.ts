import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

const KEY = 'ACCESS_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  jwtHelperService;

  constructor() {
    this.jwtHelperService = new JwtHelperService();
  }

  getAccessToken(): string {
    return localStorage.getItem(KEY);
  }

  setAccessToken(value: string): void {
    localStorage.setItem(KEY, value);
  }

  tokenHasNotExpired(): boolean {
    return !this.jwtHelperService.isTokenExpired(this.getAccessToken());
  }
}
