import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StateService } from './state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatchError } from '../decorators/catch-error';
import { Pairing } from '../../_shared/models/pairing';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  pairingsApi = 'api/pairings';

  pairings$: BehaviorSubject<Pairing[]> = new BehaviorSubject<Pairing[]>(null);

  constructor(private http: HttpClient,
              private stateService: StateService) { }

  getByYear(year = this.stateService.year.year): Observable<Pairing[]> {
    return this.http.get<Pairing[]>(`${this.pairingsApi}/${year}`).pipe(
      map(pairings => {
         pairings.forEach(p => this.stateService.setPlayingHandicapsForPairing(p));
         return pairings;
      }),
      tap(p => this.pairings$.next(p))
    );
  }

  @CatchError
  createAll(pairings: Pairing[]): Observable<Pairing[]> {
    return this.http.post<Pairing[]>(`${this.pairingsApi}/All`, pairings).pipe(
      map(data => {
        data.forEach(p => this.stateService.setPlayingHandicapsForPairing(p));
        return data;
      }),
      tap(p => this.pairings$.next(p))
    );
  }

  @CatchError
  create(pairing: Pairing): Observable<Pairing> {
    return this.http.post<Pairing>(this.pairingsApi, pairing);
  }

  @CatchError
  update(pairingId: string, update: Partial<Pairing>): Observable<Pairing> {
    return this.http.patch<Pairing>(`${this.pairingsApi}/${pairingId}`, update);
  }

  @CatchError
  delete(pairingId: string): Observable<void> {
    return this.http.delete<void>(`${this.pairingsApi}/${pairingId}`);
  }

}
