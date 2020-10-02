import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { YearService } from '../../services/year.service';
import { query } from '@angular/animations';

@Component({
  selector: 'isag-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;
  opened = false;

  @ViewChild('snav') sidenav;

  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public stateService: StateService,
              public authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () =>  changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this._mobileQueryListener();
  }

  closeSideNav(): void {
    if (this.mobileQuery.matches) {
      this.sidenav.close();
      (document.activeElement as HTMLButtonElement).blur();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
