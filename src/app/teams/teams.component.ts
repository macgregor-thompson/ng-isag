import { Component, OnInit } from '@angular/core';

import { merge as _merge } from 'lodash-es';

import { YearService } from '../_core/services/year.service';
import { Year } from '../_shared/models/years/year';
import { StateService } from '../_core/services/state.service';
import { Team } from '../_shared/models/teams/team';
import { TeamService } from '../_core/services/team.service';
import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'isag-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  selectedYear: Year;
  teams: Team[];
  aPlayers: Player[];
  bPlayers: Player[];
  usedAPLayerIds: { [playerId: string]: true };
  usedBPLayerIds: { [playerId: string]: true };
  editing = false;
  updateSub = new Subject<[Team, keyof Team]>();
  subscriptions = new Subscription();


  constructor(public yearService: YearService,
              public stateService: StateService,
              private playerService: PlayerService,
              private teamService: TeamService) { }

  ngOnInit(): void {
    this.selectedYear = this.stateService.year;
    this.getTeamsAndPlayers();

    this.subscriptions.add(this.updateSub.pipe(debounceTime(400)).subscribe(x => this.saveOrUpdateTeam(...x)));
  }

  getTeamsAndPlayers(): void {
    this.usedAPLayerIds = {};
    this.usedBPLayerIds = {};
    this.getTeams();
    this.getPlayers();
  }

  getPlayers(): void {
    [this.aPlayers, this.bPlayers] = this.playerService.aAndBPlayers(this.selectedYear);
  }

  getTeams(): void {
    this.teamService.getByYear(this.selectedYear.year).subscribe({
      next: teams => {
        this.teams = teams;
        teams.forEach(t => {
          this.usedAPLayerIds[t.playerA._id] = true;
          this.usedBPLayerIds[t.playerB._id] = true;
        });
      }
    });
  }

  addTeam(): void {
    this.teams.push(new Team(this.selectedYear.year));
  }

  getPlayerName(player: Player) {
    return `${player?.firstName} ${player?.lastName}`;
  }

  saveOrUpdateTeam(team: Team, prop: keyof Team): void {
    if (team.playerA._id && team.playerA.handicap != null
      && team.playerB._id && team.playerB.handicap != null) {
      if (team._id) {
        this.teamService.update(team._id, {[prop]: team[prop]}).subscribe();
      } else {
        this.usedAPLayerIds[team.playerA._id] = true;
        this.usedBPLayerIds[team.playerB._id] = true;
        this.teamService.create(team).subscribe({
          next: t => _merge(team, t)
        });
      }
    }
  }

  deleteTeam(team: Team, i: number): void {
    this.teamService.delete(team._id).subscribe({
      next: () => {
        this.teams.splice(i, 1);
        delete this.usedAPLayerIds[team.playerA._id];
        delete this.usedBPLayerIds[team.playerB._id];
      }
    });
  }

}
