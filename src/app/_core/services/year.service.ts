import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Player } from '../../_shared/models/player';
import { Year } from '../../_shared/models/years/year';
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

  // adding and editing years
  availableYears: number[];
  nextAvailableYear: number;
  existingYears: { [key: number]: boolean } = {};


  constructor(private http: HttpClient,
              private appInitializerService: AppInitializerService,
              private stateService: StateService,
              private spinnerService: SpinnerService) {
    this.years = this.appInitializerService.years;

    this.availableYears = (() => {
      let year = new Date().getFullYear() + 5;
      const years = [year];
      while (year >= 1985) {
        years.push(year--);
      }
      return years;
    })();
    this.nextAvailableYear = (this.years.reduce((prev, current) => (prev.year > current.year) ? prev : current)).year + 1;
    this.years.forEach(y => this.existingYears[y.year] = true);

  }

  @SpinnerAndCatchError
  getAll(): Observable<Year[]> {
    return this.http.get<Year[]>(this.yearsApi);
  }

  @SpinnerAndCatchError
  getYearWithPlayers(year = this.stateService.year.year): Observable<Array<Year & { players: Player[] }>> {
    return this.http.get<Array<Year & { players: Player[] }>>(`${this.yearsApi}/${year}`);
  }

  @SpinnerAndCatchError
  create(year: Year): Observable<Year> {
    return this.http.post<Year>(this.yearsApi, year);
  }

  @SpinnerAndCatchError
  update(yearId: string, update: Partial<Year>): Observable<Year> {
    return this.http.patch<Year>(`${this.yearsApi}/${yearId}`, update);
  }

  @SpinnerAndCatchError
  setCurrent(yearId: string): Observable<Year> {
    return this.http.patch<Year>(`${this.yearsApi}/${yearId}/SetCurrent`, {});
  }

  @SpinnerAndCatchError
  delete(yearId: string): Observable<Year> {
    const index = this.years.findIndex(y => y._id === yearId);
    this.years.splice(index, 1);
    this.years = this.years.slice();
    return this.update(yearId, { deleted: true });
  }

  yearsAreSameById(option, value): boolean {
    return option._id === value._id;
  }

  yearsAreSame(option, value): boolean {
    return option.year === value.year;
  }


}
