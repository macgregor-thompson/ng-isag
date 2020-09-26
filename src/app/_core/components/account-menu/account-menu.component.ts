import { Component, OnInit } from '@angular/core';

import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'isag-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent implements OnInit {

  constructor(public stateService: StateService,
              public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  loginOrSignUp(url: '/login' | '/signup'): void {
    this.authService.redirectUrl = this.router.url;
    this.router.navigate([url]);
  }

}
