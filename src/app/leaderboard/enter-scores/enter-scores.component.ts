import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Course } from '../../_shared/models/course/course';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { filter, Subscription } from 'rxjs';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';

@Component({
  selector: 'isag-enter-scores',
  templateUrl: './enter-scores.component.html',
  styleUrls: ['./enter-scores.component.scss']
})
export class EnterScoresComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  card: Scorecard;
  playerAName: string;
  playerBName: string;
  currentHole: number;

  constructor(public stateService: StateService, public scorecardService: ScorecardService) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.scorecardService.myTeamScorecard$.pipe(filter(c => !!c)).subscribe({
        next: c => {
          this.card = c;
          // set this appropriately
          this.currentHole = 1;

          this.playerAName = c.team.playerA.firstName + ' ' + c.team.playerA.lastName;
          this.playerBName = c.team.playerB.firstName + ' ' + c.team.playerB.lastName;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
