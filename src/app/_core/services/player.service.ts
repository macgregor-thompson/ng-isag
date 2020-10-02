import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Player } from '../../_shared/models/player';
import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { SpinnerService } from './spinner.service';
import { CatchError } from '../decorators/catch-error';
import { StateService } from './state.service';
import { AppInitializerService } from '../../app-initializer.service';
import { OrderByPipe } from '../../_shared/pipes/order-by.pipe';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersApi = 'api/players';
  allPlayers: Player[];

  constructor(private http: HttpClient,
              private stateService: StateService,
              private appInitializerService: AppInitializerService,
              private spinnerService: SpinnerService,
              private orderByPipe: OrderByPipe) {
    this.allPlayers = this.appInitializerService.allPlayers;
  }

  @SpinnerAndCatchError
  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersApi)
      .pipe(tap(p => this.allPlayers = p));
  }

  getByYear(year = this.stateService.year.year): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.playersApi}/${year}`);
  }

  @CatchError
  create(player: Player): Observable<Player> {
    return this.http.post<Player>(this.playersApi, player)
      .pipe(tap(newPlayer => this.allPlayers.push(newPlayer)));
  }

  @CatchError
  update(playerId: string, update: Partial<Player>): Observable<void> {
    return this.http.patch<void>(`${this.playersApi}/${playerId}`, update);
  }

  @CatchError
  delete(playerId: string): Observable<void> {
    return this.http.patch<void>(`${this.playersApi}/${playerId}`, { deleted: true } )
      .pipe(tap(player => {
        const index = this.allPlayers.findIndex(p => p._id === playerId);
        this.allPlayers.splice(index, 1);
      }));
  }

  aAndBPlayers(year = this.stateService.year): [Player[], Player[]] {
    const aPlayers = this.allPlayers.filter(p => year.aPlayerIds.includes(p._id));
    const bPlayers = this.allPlayers.filter(p => year.bPlayerIds.includes(p._id));
    return [this.orderByPipe.transform(aPlayers, 'handicap', false),
      this.orderByPipe.transform(bPlayers, 'handicap', false)];
  }

}
