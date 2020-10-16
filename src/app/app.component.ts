import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatIconRegistry } from '@angular/material/icon';
import { filter, map, mergeMap } from 'rxjs/operators';

import { SpinnerService } from './_core/services/spinner.service';
import { StateService } from './_core/services/state.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'isag-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public spinnerService: SpinnerService,
              public router: Router,
              private activatedRoute: ActivatedRoute,
              private stateService: StateService,
              private matIconRegistry: MatIconRegistry,
              domSanitizer: DomSanitizer,
              location: PlatformLocation) {
    const baseHref = location.getBaseHrefFromDOM();

    this.matIconRegistry.addSvgIcon(
      `bra`,
      domSanitizer.bypassSecurityTrustResourceUrl(`${baseHref}assets/icons/bra-1.svg`)
    );

    this.matIconRegistry.addSvgIcon(
      `jacket`,
      domSanitizer.bypassSecurityTrustResourceUrl(`${baseHref}assets/icons/jacket-1.svg`)
    );

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
