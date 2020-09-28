import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Player } from '../../_shared/models/player';
import { Year } from '../../_shared/models/year';
import { StateService } from './state.service';
import { AppInitializerService } from '../../app-initializer.service';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  years: Year[];
  yearsApi = 'api/years';

  constructor(private http: HttpClient,
              private appInitializerService: AppInitializerService,
              private stateService: StateService,
              private spinnerService: SpinnerService) {
    this.years = this.appInitializerService.years;
  }

  @SpinnerAndCatchError
  getAll(): Observable<Year[]> {
    return this.http.get<Year[]>(this.yearsApi);
  }

  @SpinnerAndCatchError
  getYearWithPlayers(year = this.stateService.currentYear): Observable<Array<Year & { players: Player[] }>> {
    return this.http.get<Array<Year & { players: Player[] }>>(`${this.yearsApi}/${year}`);
  }
}
