import { Component, Input } from '@angular/core';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { Course } from '../../_shared/models/course/course';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { PlayerScorecard } from '../../_shared/models/scorecards/player-scorecard';

@Component({
  selector: 'isag-live-leaderboard',
  templateUrl: './live-leaderboard.component.html',
  styleUrls: ['./live-leaderboard.component.scss']
})
export class LiveLeaderboardComponent {
  @Input() leaderboard: Scorecard[];
  @Input() course: Course;

  playerScorecards: PlayerScorecard[];
  showScorecards: { [teamId: string]: boolean } = {};

  constructor(public stateService: StateService, public scorecardService: ScorecardService) {}



  togglePlayerViews(teamId: string): void {
    this.showScorecards[teamId] = !this.showScorecards[teamId];
  }

}
