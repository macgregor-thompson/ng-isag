import { Component } from '@angular/core';

import { SpinnerService } from './_core/services/spinner.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { StateService } from './_core/services/state.service';

@Component({
  selector: 'isag-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public spinnerService: SpinnerService,
              public router: Router,
              private activatedRoute: ActivatedRoute,
              private stateService: StateService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    )
      .subscribe(data => this.stateService.onRouteChange(data));
  }


}
