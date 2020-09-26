import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Player } from '../../_shared/models/player';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { SpinnerService } from './spinner.service';
import { CatchError } from '../decorators/catch-error';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersApi = 'api/players';

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService) {}

  @SpinnerAndCatchError
  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersApi);
  }

  @SpinnerAndCatchError
  getByYear(year: number): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.playersApi}?year=${year}`);
  }

  @CatchError
  create(player: Player): Observable<Player> {
    return this.http.post<Player>(this.playersApi, player);
  }

  @CatchError
  update(playerId: string, update: Partial<Player>): Observable<void> {
    return this.http.patch<void>(`${this.playersApi}/${playerId}`, update);
  }

  @CatchError
  delete(playerId: string): Observable<void> {
    return this.http.patch<void>(`${this.playersApi}/${playerId}`, { deleted: true } );
  }

}
