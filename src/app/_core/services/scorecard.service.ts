import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  scorecardApi = 'api/scorecards';

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) { }

  @SpinnerAndCatchError
  getAll(): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${this.scorecardApi}`);
  }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Scorecard[]> {
    return this.http.get<Scorecard[]>(`${this.scorecardApi}/${year}`);
  }

  @SpinnerAndCatchError
  create(scorecard: Scorecard): Observable<Scorecard> {
    return this.http.post<Scorecard>(this.scorecardApi, scorecard);
  }

  @SpinnerAndCatchError
  update(scorecardId: string, update: Partial<Scorecard>): Observable<Scorecard> {
    return this.http.patch<Scorecard>(`${this.scorecardApi}/${scorecardId}`, update);
  }

  @SpinnerAndCatchError
  delete(scorecardId: string): Observable<Scorecard> {
    return this.update(scorecardId, {deleted: true});
  }
}
