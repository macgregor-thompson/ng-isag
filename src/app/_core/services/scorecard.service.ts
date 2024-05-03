import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { omitBy as _omitBy, isNil as _isNil } from 'lodash';
import { tap } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { Scores } from '../../_shared/models/scorecards/scores';
import { Hole } from '../../_shared/models/course/hole';
import { HoleNumber } from '../../_shared/models/course/hole-number';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  scorecardApi = 'api/scorecards';

  myPairingScorecards$ = new BehaviorSubject<[Scorecard, Scorecard]>(null);
  scoringId = localStorage.getItem('scoringId');

  teamScorecards$ = new BehaviorSubject<Scorecard[]>(null);
  holes: { [key: string]: Hole };


  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService,
              private socket: Socket) {
    this.holes = { ...this.stateService.course.frontNine, ...this.stateService.course.backNine };

    this.getLeaderboard().subscribe();

    setTimeout(() => {
      if (this.scoringId) this.getMyTeamScorecard().subscribe();
    });

    this.socket.on('scoreCardUpdated', (data) => {
      this.getLeaderboardInBackground();
    });
    this.socket.on('connect', (data) => {
      console.log('connect', data);
    });

    this.socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });

  }

  @SpinnerAndCatchError
  getAll(): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${ this.scorecardApi }`);
  }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${ this.scorecardApi }/${ year }`);
  }

  @SpinnerAndCatchError
  ohShit(year: number = this.stateService.year.year): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${ this.scorecardApi }/${ year }/OhShit`);
  }

  @SpinnerAndCatchError
  getMyTeamScorecard(scoringId = this.scoringId, year: number = this.stateService.year.year): Observable<[Scorecard, Scorecard]> {
    return this.http.get<[Scorecard, Scorecard]>(`${ this.scorecardApi }/${ year }/MyPairingScorecards/${ scoringId }`).pipe(
      tap(cards => {
        if (!cards) throw new Error('Can\'t find scorecard with that scoring ID');
        this.myPairingScorecards$.next(cards);
        if (scoringId !== this.scoringId) {
          localStorage.setItem('scoringId', scoringId);
        }
      })
    );
  }

  @SpinnerAndCatchError
  updateScores(scorecardId: string, update: Partial<Scorecard>): Observable<Scorecard> {
    return this.http.patch<Scorecard>(`${ this.scorecardApi }/${ scorecardId }/MyPairingScorecards`, update).pipe(
      tap(() => this.getLeaderboardInBackground())
    );
  }

  @SpinnerAndCatchError
  updateTeeTimes(update: { teamIds: string[]; teeTime: string }, year: number = this.stateService.year.year): Observable<Scorecard> {
    return this.http.patch<Scorecard>(`${ this.scorecardApi }/${ year }/UpdateTeeTimes`, update);
  }


  @SpinnerAndCatchError
  getLeaderboard(year: number = this.stateService.year.year): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${ this.scorecardApi }/${ year }/Leaderboard`).pipe(
      tap(cards => {
        // should be hopefully ordered and normalized by now.
        this.teamScorecards$.next(cards);
        // PlayerScorecard class
      })
    );
  }

  getLeaderboardInBackground(): void {
    this.getLeaderboard().subscribe();
  }

  @SpinnerAndCatchError
  create(scorecard: Scorecard): Observable<Scorecard> {
    return this.http.post<Scorecard>(this.scorecardApi, scorecard);
  }

  @SpinnerAndCatchError
  createTeamScorecards(courseId: string = this.stateService.course._id,
                       year: number = this.stateService.year.year): Observable<Scorecard[]> {
    return this.http.post<Scorecard[]>(`${ this.scorecardApi }/${ year }/CreateTeamScorecards`, { courseId });
  }

  @SpinnerAndCatchError
  update(scorecardId: string, update: Partial<Scorecard>): Observable<Scorecard> {
    return this.http.patch<Scorecard>(`${ this.scorecardApi }/${ scorecardId }`, update);
  }


  @SpinnerAndCatchError
  delete(scorecardId: string): Observable<Scorecard> {
    return this.update(scorecardId, { deleted: true });
  }

  @SpinnerAndCatchError
  updateShotsByHole(year: number = this.stateService.year.year): Observable<void> {
    return this.http.post<void>(`${ this.scorecardApi }/${ year }/UpdateShotsByHole`, {});
  }

  saveAllScores(): void {
    const cards = this.teamScorecards$.getValue();
    cards.forEach(c => {
      this.setScoresForCard(c);
      this.updateScores(c._id, c).subscribe();
    });
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


    console.log('frontNineACompleted A', frontNineACompleted);
    console.log('backNineACompleted A', backNineACompleted);

    console.log('frontNineACompleted B', frontNineBCompleted);
    console.log('backNineACompleted B', backNineBCompleted);
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

  setScoresForCard(card: Scorecard): void {
    this.setPlayerGrossScores(card);
    this.setPlayerNetScores(card);
    this.setTeamScores(card);
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
      card.thru = Math.max(...Object.keys(nonNullScores).map(k => +k)) as HoleNumber;
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


}
