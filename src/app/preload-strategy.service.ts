import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';

import { Observable, of } from 'rxjs';

import { StateService } from './_core/services/state.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadStrategyService implements PreloadingStrategy {

  constructor(public stateService: StateService) {}

  preload(route: Route, load: Function): Observable<any> {

    if (route.data) {
      const { checkMinRole } = route.data;

      const isRouteAuthorized = !checkMinRole ||  this.stateService.currentUser?.role <= checkMinRole;

      if (checkMinRole) console.log('isRouteAuthorized:', isRouteAuthorized);

      return isRouteAuthorized ? load() : of(null);
    }
    return load();
  }

}
