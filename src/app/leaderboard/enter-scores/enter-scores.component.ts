import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { filter, Subscription } from 'rxjs';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { flatMap as _flatMap, omitBy as _omitBy, isNil as _isNil } from 'lodash';
import { Hole } from '../../_shared/models/course/hole';
import { Scores } from '../../_shared/models/scorecards/scores';
import { Score } from '../../_shared/models/scorecards/score';
import { forEach } from 'lodash-es';

@Component({
  selector: 'isag-enter-scores',
  templateUrl: './enter-scores.component.html',
  styleUrls: ['./enter-scores.component.scss']
})
export class EnterScoresComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  cardA: Scorecard;
  cardB: Scorecard;
  holes: { [key: string]: Hole };
  currentHole: number;
  canSave: boolean;

  constructor(public stateService: StateService, public scorecardService: ScorecardService) {
    this.holes = { ...this.stateService.course.frontNine, ...this.stateService.course.backNine };
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
          this.setCurrentHole();
          // set this appropriately
          this.currentHole = this.cardA.thru + 1 || 1;
          this.checkIfCanSave();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  setCurrentHole(): void {
    const allScores = [
      this.cardA.playerAScores.grossScores,
      this.cardA.playerBScores.grossScores,
      this.cardB.playerAScores.grossScores,
      this.cardB.playerBScores.grossScores];
    //let current = 1;
    const nonNullScores = _flatMap(allScores, scores => _omitBy(scores, _isNil));
    console.log('nonNullScores', nonNullScores);
    this.currentHole = 1;
  }

  nextHole(): void {
    if (this.currentHole === 18) this.currentHole = 1;
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
    this.setNetScores(this.cardA);
    this.setNetScores(this.cardB);
    this.scorecardService.updateScores(this.cardA._id, this.cardA).subscribe();
    this.scorecardService.updateScores(this.cardB._id, this.cardB).subscribe();
    this.nextHole();
  }

  setNetScores(card: Scorecard): void {
    this.setPlayerGrossScores(card);
    this.setPlayerNetScores(card);
    this.setTeamScores(card);
  }


  setPlayerGrossScores(card: Scorecard): void {
    const frontNine = Array.from({ length: 9 }, (_, i) => i + 1);
    const backNine = Array.from({ length: 9 }, (_, i) => i + 10);
    const frontNineACompleted = frontNine.every(h => !!card.playerAScores.grossScores[h]);
    const backNineACompleted = backNine.every(h => !!card.playerAScores.grossScores[h]);
    if (frontNineACompleted) card.playerAScores.frontNineGrossScore = this.sumHoles(card.playerAScores.grossScores, 1, 9);
    if (backNineACompleted) card.playerAScores.backNineGrossScore = this.sumHoles(card.playerAScores.grossScores, 10, 9);
    if (frontNineACompleted && backNineACompleted)
      card.playerAScores.totalGrossScore = this.sumHoles(card.playerAScores.grossScores, 1, 18);

    const frontNineBCompleted = frontNine.every(h => !!card.playerBScores.grossScores[h]);
    const backNineBCompleted = backNine.every(h => !!card.playerBScores.grossScores[h]);
    if (frontNineBCompleted) card.playerBScores.frontNineGrossScore = this.sumHoles(card.playerBScores.grossScores, 1, 9);
    if (backNineBCompleted) card.playerBScores.backNineGrossScore = this.sumHoles(card.playerBScores.grossScores, 10, 9);
    if (frontNineBCompleted && backNineBCompleted)
      card.playerBScores.totalGrossScore = this.sumHoles(card.playerBScores.grossScores, 1, 18);
  }

  setPlayerNetScores(card: Scorecard): void {
    const frontNine = Array.from({ length: 9 }, (_, i) => i + 1);
    const backNine = Array.from({ length: 9 }, (_, i) => i + 10);

    [...frontNine, ...backNine].forEach(h => {
      if (card.playerAScores.grossScores[h])
        card.playerAScores.netScores[h] = card.playerAScores.grossScores[h] - card.playerAScores.shotsByHole[h];
      if (card.playerBScores.grossScores[h])
        card.playerBScores.netScores[h] = card.playerBScores.grossScores[h] - card.playerBScores.shotsByHole[h];
    });

    const frontNineACompleted = frontNine.every(h => !!card.playerAScores.netScores[h]);
    const backNineACompleted = backNine.every(h => !!card.playerAScores.netScores[h]);
    if (frontNineACompleted) card.playerAScores.frontNineNetScore = this.sumHoles(card.playerAScores.netScores, 1, 9);
    if (backNineACompleted) card.playerAScores.backNineNetScore = this.sumHoles(card.playerAScores.netScores, 10, 9);
    if (frontNineACompleted && backNineACompleted)
      card.playerAScores.totalNetScore = card.playerAScores.frontNineNetScore + card.playerAScores.backNineNetScore;

    const frontNineBCompleted = frontNine.every(h => !!card.playerBScores.netScores[h]);
    const backNineBCompleted = backNine.every(h => !!card.playerBScores.netScores[h]);
    if (frontNineBCompleted) card.playerBScores.frontNineNetScore = this.sumHoles(card.playerBScores.netScores, 1, 9);
    if (backNineBCompleted) card.playerBScores.backNineNetScore = this.sumHoles(card.playerBScores.netScores, 10, 9);
    if (frontNineBCompleted && backNineBCompleted)
      card.playerBScores.totalNetScore = card.playerBScores.frontNineNetScore + card.playerBScores.backNineNetScore;

  }


  setTeamScores(card: Scorecard): void {
    const frontNine = Array.from({ length: 9 }, (_, i) => i + 1);
    const backNine = Array.from({ length: 9 }, (_, i) => i + 10);

    [...frontNine, ...backNine].forEach(h => {
      if (card.playerAScores.netScores[h] && card.playerBScores.netScores[h])
        card.teamNetScores[h] = Math.min(card.playerAScores.netScores[h], card.playerBScores.netScores[h]);
    });

    const nonNullScores = _omitBy(card.teamNetScores, _isNil);
    let thruPar = 0;
    if (nonNullScores) {
      card.thru = Math.max(...Object.keys(nonNullScores).map(k => +k));
      thruPar = Object.keys(nonNullScores).reduce((acc, key) => {
        acc += this.holes[key].par;
        return acc;
      }, 0);
    }
    console.log('current net to par', this.sumHoles(card.teamNetScores, 1, 18), thruPar);
    card.currentNetToPar = this.sumHoles(card.teamNetScores, 1, 18) - thruPar;


    const frontNineBCompleted = frontNine.every(h => !!card.playerBScores.netScores[h]);
    const backNineBCompleted = backNine.every(h => !!card.playerBScores.netScores[h]);
    if (frontNineBCompleted) card.frontNineNetScore = this.sumHoles(card.teamNetScores, 1, 9);
    if (backNineBCompleted) card.backNineNetScore = this.sumHoles(card.teamNetScores, 10, 9);
    if (frontNineBCompleted && backNineBCompleted) card.totalNetScore = card.frontNineNetScore + card.backNineNetScore;
  }


  sumHoles(scores: Scores, start: 1 | 10, numHoles: 9 | 18 = 9): number {
    const keys = Array.from({ length: numHoles }, (_, i) => i + start);
    return keys.reduce((a, b) => a + (scores[b] != null || !isNaN(scores[b]) ? scores[b] : 0), 0);
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
