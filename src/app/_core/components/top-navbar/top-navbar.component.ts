import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'isag-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

  pageTitle$: Observable<string>;
  logo = 'assets/img/ISAG_logo.png';
  navLinks = [
    { path: '', label: 'RESULTS', icon: 'emoji_events' },
    { path: '/players', label: 'PLAYERS', icon: 'people' }
  ];

  constructor(public stateService: StateService,
              public authService: AuthService) {}

  ngOnInit() {
  }

  openCreateIssueDialog() {
  }

}
