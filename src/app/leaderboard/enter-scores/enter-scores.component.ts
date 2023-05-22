import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { filter, Subscription } from 'rxjs';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { flatMap as _flatMap, omitBy as _omitBy, isNil as _isNil } from 'lodash';
import { Scores } from '../../_shared/models/scorecards/scores';

@Component({
  selector: 'isag-enter-scores',
  templateUrl: './enter-scores.component.html',
  styleUrls: ['./enter-scores.component.scss']
})
export class EnterScoresComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  cardA: Scorecard;
  cardB: Scorecard;
  currentHole: number;
  canSave: boolean;

  constructor(public stateService: StateService, public scorecardService: ScorecardService) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.scorecardService.myPairingScorecards$.pipe(filter(c => !!c)).subscribe({
        next: cards => {
          cards.forEach(c => {
            c.team.playerA.name = c.team.playerA.firstName + ' ' + c.team.playerA.lastName;
            c.team.playerB.name = c.team.playerB.firstName + ' ' + c.team.playerB.lastName;
          });
          [this.cardA, this.cardB] = cards;
          this.setCurrentHole(this.cardA.thru, this.cardB.thru);
          this.checkIfCanSave();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setCurrentHole(thruA, thruB): void {
    if (!thruA || !thruB || (thruA === 18 && thruB === 18)) {
      this.currentHole = 1;
      return;
    }
    if (thruA !== thruB) {
      this.currentHole = Math.min(thruA, thruB);
      return;
    }
    this.currentHole = thruA + 1;
  }

  nextHole(): void {
    if (!this.currentHole || this.currentHole === 18) this.currentHole = 1;
    else this.currentHole++;
    this.checkIfCanSave();
  }

  prevHole(): void {
    if (this.currentHole === 1) this.currentHole = 18;
    else this.currentHole--;
    this.checkIfCanSave();
  }

  clearScores(): void {
    this.cardA.playerAScores.grossScores[this.currentHole] = null;
    this.cardA.playerBScores.grossScores[this.currentHole] = null;
    this.cardB.playerAScores.grossScores[this.currentHole] = null;
    this.cardB.playerBScores.grossScores[this.currentHole] = null;
    this.canSave = false;
  }

  saveScores(): void {
    this.scorecardService.setScoresForCard(this.cardA);
    this.scorecardService.setScoresForCard(this.cardB);
    this.scorecardService.updateScores(this.cardA._id, this.cardA).subscribe();
    this.scorecardService.updateScores(this.cardB._id, this.cardB).subscribe();
    this.nextHole();
  }


  checkIfCanSave(): void {
    this.canSave = [
      this.cardA.playerAScores.grossScores[this.currentHole],
      this.cardA.playerBScores.grossScores[this.currentHole],
      this.cardB.playerAScores.grossScores[this.currentHole],
      this.cardB.playerBScores.grossScores[this.currentHole]
    ].every(s => !!s);
  }
}
