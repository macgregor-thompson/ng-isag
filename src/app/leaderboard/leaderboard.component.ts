import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../_core/services/state.service';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';

@Component({
  selector: 'isag-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  routes = [
    { path: 'live', title: 'Leaderboard', icon: 'scoreboard' },
    { path: 'scores', title: 'Enter Scores', icon: 'edit' },
  ];
  selectedIndex: 0 | 1 | 2 = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public stateService: StateService) {}

  ngOnInit(): void {
    this.setTab();
  }

  setTab() {
    const tab = this.activatedRoute.snapshot.paramMap.get('tab');
    switch (tab.toLowerCase()) {
      case 'live':
        this.selectedIndex = 0;
        this.stateService.setTitle(`Leaderboard`);
        this.router.navigate(['leaderboard/', 'live'] );
        break;
      case 'admin':
        this.selectedIndex = 2;
        this.stateService.setTitle(`Admin Scores`);
        this.router.navigate(['leaderboard/', 'admin'] );
        break;
      default:
        this.selectedIndex = 1;
        this.stateService.setTitle(`Enter Scores`);
        this.router.navigate(['leaderboard/', 'scores'], );
        break;
    }
  }

  updateQueryParam(tab: MatTabChangeEvent): void {
    const name = (() => {
      switch (tab.index) {
        case 1:
          return 'scores';
        case 2:
          return 'admin';
        default:
          return 'live';
      }
    })();
    this.router.navigate(['leaderboard/', name] );

  }

}
