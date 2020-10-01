import { Component, OnInit } from '@angular/core';

import { chunk as _chunk, merge as _merge } from 'lodash';

import { YearService } from '../_core/services/year.service';
import { Year } from '../_shared/models/year';
import { StateService } from '../_core/services/state.service';
import { Team } from '../_shared/models/teams/team';
import { TeamService } from '../_core/services/team.service';
import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { OrderByPipe } from '../_shared/pipes/order-by.pipe';
import { SpinnerService } from '../_core/services/spinner.service';

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
  editing = false;
  gettingPlayers: boolean;
  gettingTeams: boolean;

  constructor(public yearService: YearService,
              public stateService: StateService,
              private playerService: PlayerService,
              public spinnerService: SpinnerService,
              private teamService: TeamService,
              private orderByPipe: OrderByPipe) { }

  ngOnInit(): void {
    this.selectedYear = this.stateService.currentYear;
    this.getTeamsAndPlayers();
  }

  getTeamsAndPlayers(): void {
    this.getTeams();
    this.getPlayers();
  }

  getPlayers(): void {
    this.spinnerService.start();
    this.playerService.getByYear(this.selectedYear.year).subscribe({
      next: p => {
        const orderedByHandicap = this.orderByPipe.transform(p, 'handicap', false);
        [this.aPlayers, this.bPlayers] = _chunk(orderedByHandicap, (orderedByHandicap.length / 2));
      },
      complete: () => {
        this.gettingPlayers = false;
        this.turnOffSpinner();
      }
    });
  }

  getTeams(): void {
    this.spinnerService.start();
    this.teamService.getByYear(this.selectedYear.year).subscribe({
      next: t => this.teams = t,
      complete: () => {
        this.gettingTeams = false;
        this.turnOffSpinner();
      }
    });
  }

  addTeam(): void {
    this.teams.push(new Team(this.selectedYear.year));
  }

  getPlayerName(player: Player) {
    return `${player?.firstName} ${player?.lastName}`;
  }

  saveTeam(team: Team): void {
    if (team.playerA._id && team.playerB._id) {
      team.playerA.playerId = team.playerA._id;
      team.playerB.playerId = team.playerB._id;
      team._id ? this.teamService.update(team._id, team).subscribe()
        : this.teamService.create(team).subscribe({
          next: t => _merge(team, t)
        });
    }
  }

  turnOffSpinner(): void {
    if (!this.gettingTeams && !this.gettingPlayers) this.spinnerService.stop();
  }
}
