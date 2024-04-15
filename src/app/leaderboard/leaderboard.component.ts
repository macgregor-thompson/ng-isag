import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../_core/services/state.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

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
  selectedIndex: 0 | 1 = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private stateService: StateService) {}

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
      default:
        this.selectedIndex = 1;
        this.stateService.setTitle(`Enter Scores`);
        this.router.navigate(['leaderboard/', 'scores'], );
        break;
    }
  }

  updateQueryParam(tab: MatTabChangeEvent): void {
    const name = tab.index === 1 ? 'scores' : 'live';
    this.router.navigate(['leaderboard/', name] );

  }

}
