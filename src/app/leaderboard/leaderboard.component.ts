import { Component } from '@angular/core';
import { LeaderboardService } from '../_core/services/leaderboard.service';

@Component({
  selector: 'isag-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  constructor(public leaderboardService: LeaderboardService) {}

}
