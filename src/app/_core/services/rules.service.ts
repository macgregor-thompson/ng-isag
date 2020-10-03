import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SpinnerService } from './spinner.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { CatchError } from '../decorators/catch-error';
import { Rules } from '../../_shared/models/rules';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  rulesApi = 'api/rules';

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) { }

  @SpinnerAndCatchError
  getByYear(year: number = this.stateService.year.year): Observable<Rules> {
    return this.http.get<Rules>(`${this.rulesApi}?year=${year}`);
  }

  @CatchError
  create(rules: Rules): Observable<Rules> {
    return this.http.post<Rules>(this.rulesApi, rules);
  }

  @CatchError
  update(rulesId: string, update: Partial<Rules>): Observable<void> {
    return this.http.patch<void>(`${this.rulesApi}/${rulesId}`, update);
  }

  @CatchError
  delete(rulesId: string): Observable<void> {
    return this.http.patch<void>(`${this.rulesApi}/${rulesId}`, { deleted: true } );
  }

}
