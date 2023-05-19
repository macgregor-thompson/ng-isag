import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { tap } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  scorecardApi = 'api/scorecards';

  myPairingScorecards$ = new BehaviorSubject<[Scorecard, Scorecard]>(null);
  scoringId = localStorage.getItem('scoringId');

  teamScorecards$ = new BehaviorSubject<Scorecard[]>(null);

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService,
              private socket: Socket) {

    this.getLeaderboard().subscribe();

    setTimeout(() => {
      if (this.scoringId) this.getMyTeamScorecard().subscribe();
    });

    this.socket.on('scoreCardUpdated', (data) => {
      // update leaderboard
      this.getLeaderboard().subscribe();
    });

    // on connect, re-fetch entire scorecard

    this.socket.on('connect', (data) => {
      console.log('connect', data);
    });

    this.socket.on('disconnect', (data) => {
      console.log('disconnect', data);
    });

    this.socket.on('events', (data) => {
      console.log('events', data);
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
    return this.http.patch<Scorecard>(`${ this.scorecardApi }/${ scorecardId }/MyPairingScorecards`, update);
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


  /*  sendEvent(foo: string) {
      this.socket.emit('events', foo);
    }

    addScore(score: string) {
      this.socket.emit('scores', score);
    }*/

}
