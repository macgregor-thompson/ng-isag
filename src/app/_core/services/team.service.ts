import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { merge as _merge } from 'lodash-es';

import { SpinnerAndCatchError } from '../decorators/spinner-and-catch-error';
import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { Team } from '../../_shared/models/teams/team';
import { TeamPlayer } from '../../_shared/models/teams/team-player';
import { Player } from '../../_shared/models/player';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  teamsApi = 'api/teams';

  static playerToTeamPlayer(player: Player): TeamPlayer {
    return { playerId: player._id, handicap: player.handicap };
  }

  static convertTeamPlayers(team: Team): Team {
    return _merge(team,
      {
        playerA: TeamService.playerToTeamPlayer(team.playerA),
        playerB: TeamService.playerToTeamPlayer(team.playerB)
      });
  }

  constructor(private http: HttpClient,
              private stateService: StateService,
              private spinnerService: SpinnerService) {}

  @SpinnerAndCatchError
  getByYear(year = this.stateService.year.year): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.teamsApi}?year=${year}`);
  }

  @SpinnerAndCatchError
  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.teamsApi, team);
  }

  @SpinnerAndCatchError
  update(teamId: string, update: Partial<Team>): Observable<Team> {
    return this.http.patch<Team>(`${this.teamsApi}/${teamId}`, update);
  }

  @SpinnerAndCatchError
  delete(teamId: string): Observable<Team> {
    return this.update(teamId, { deleted: true });
  }


}
