import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanDeactivate,
  CanLoad, UrlTree, Route
} from '@angular/router';
import { StateService } from '../services/state.service';
import { LoginComponent } from '../components/login/login.component';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<LoginComponent>, CanLoad {

  constructor(private stateService: StateService,
              private authService: AuthService,
              private router: Router) {}

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfLoggedIn(state.url);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfLoggedIn(state.url);
  }

  canDeactivate(
    component: LoginComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkIfLoggedIn(state.url);
  }

  canLoad(route: Route): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.checkIfLoggedIn(route.path);
    const { checkMinRole } = route.data;
    return !checkMinRole ||  this.stateService.currentUser?.role <= checkMinRole;
   // return isAuthorized ? true : this.router.parseUrl('/') ;
  }

  checkIfLoggedIn(url: string): boolean {
    if (this.stateService.currentUser) return true;
    this.authService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
