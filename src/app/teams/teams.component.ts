import { Component, OnInit } from '@angular/core';

import { flatMap as _flatMap, merge as _merge, cloneDeep as _cloneDeep } from 'lodash-es';
import { filter, forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { StateService } from '../_core/services/state.service';
import { Team } from '../_shared/models/teams/team';
import { TeamService } from '../_core/services/team.service';
import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { CourseService } from '../_core/services/course.service';
import { Course } from '../_shared/models/course/course';
import { Pairing } from '../_shared/models/pairing';
import { PairingService } from '../_core/services/pairing.service';


@Component({
  selector: 'isag-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[];
  course: Course;
  aPlayers: Player[];
  bPlayers: Player[];
  usedAPLayerIds: { [playerId: string]: true };
  usedBPLayerIds: { [playerId: string]: true };
  editing = false;
  updateSub = new Subject<[Team, keyof Team]>();
  subscriptions = new Subscription();
  pairings: Pairing[];

  constructor(public courseService: CourseService,
              public stateService: StateService,
              private playerService: PlayerService,
              private teamService: TeamService,
              private pairingService: PairingService) { }

  ngOnInit(): void {
    this.getTeamsAndPlayers();
    this.courseService.getByYear().subscribe(c => {
      this.course = c;
      this.updateHandicaps();
    });
    this.subscriptions.add(this.updateSub.pipe(debounceTime(400)).subscribe(x => this.saveOrUpdateTeam(...x)));

    this.pairingService.getByYear().pipe(filter(p => !!p && !!p.length)).subscribe({
      next: pairings => this.pairings = pairings
    });
  }

  getTeamsAndPlayers(): void {
    this.usedAPLayerIds = {};
    this.usedBPLayerIds = {};
    this.getTeams();
    this.getPlayers();
  }

  getPlayers(): void {
    [this.aPlayers, this.bPlayers] = this.playerService.aAndBPlayers(this.stateService.year);
  }

  getTeams(): void {
    this.teamService.getByYear(this.stateService.year.year).subscribe({
      next: teams => {
        this.teams = teams;
        teams.forEach(t => {
          this.usedAPLayerIds[t.playerA._id] = true;
          this.usedBPLayerIds[t.playerB._id] = true;
        });
        this.updateHandicaps();
      }
    });
  }

  addTeam(): void {
    this.teams.push(new Team(this.stateService.year.year));
  }

  getPlayerName(player: Player) {
    return `${player?.firstName} ${player?.lastName}`;
  }

  saveOrUpdateTeam(team: Team, prop: keyof Team): void {
    if (team.playerA._id && team.playerA.handicap != null && team.playerB._id && team.playerB.handicap != null) {
      this.updateHandicaps();
      if (team._id) {
        this.teamService.update(team._id, { [prop]: team[prop] }).subscribe();
      } else {
        this.usedAPLayerIds[team.playerA._id] = true;
        this.usedBPLayerIds[team.playerB._id] = true;
        this.teamService.create(team).subscribe({
          next: t => _merge(team, t)
        });
      }
    }
  }

  updateHandicaps(): void {
    if (!this.course || !this.teams) return;
    const slope = this.course.slope / 113;
    const rating = this.course.courseRating - this.course.frontNinePar - this.course.backNinePar;

    this.teams.forEach(t => {
      t.playerA.courseHandicap = -Math.round(-t.playerA.handicap * slope + rating);
      t.playerA.playingHandicap = -Math.round(-t.playerA.courseHandicap * this.stateService.year.handicapAllowance / 100);

      t.playerB.courseHandicap = -Math.round(-t.playerB.handicap * slope + rating);
      t.playerB.playingHandicap = -Math.round(-t.playerB.courseHandicap * this.stateService.year.handicapAllowance / 100);
    });
  }

  updatePlayingHandicaps(): void {
    this.teams.forEach(t => {
      t.playerA.playingHandicap = -Math.round(-t.playerA.courseHandicap * this.stateService.year.handicapAllowance / 100);
      t.playerB.playingHandicap = -Math.round(-t.playerB.handicap * this.stateService.year.handicapAllowance / 100);
    });
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

  toggleEdit(): void {
    this.editing = !this.editing;
    if (!this.editing) {
      this.updateHandicaps();
      const observables = this.teams.map(t => {
        const update: Partial<Team> = { playerA: t.playerA, playerB: t.playerB };
        return this.teamService.update(t._id, update);
      });
      forkJoin(observables).subscribe();
    }
  }



  createPairings(): void {
    const pairings = [];
    const startTime = 0;
    const teams = _cloneDeep(this.teams);
    let ordinal = 0;
     while (teams.length) {
       const couple: [Team, Team] = teams.splice(0, 2) as [Team, Team];
       pairings.push(new Pairing(couple, this.stateService.year.year, ordinal));
       ordinal++;
     }
     this.pairingService.createAll(pairings).subscribe({
       next: p => this.pairings = p
     });
  }

}
