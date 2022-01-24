import { Component, OnInit } from '@angular/core';

import { flatMap as _flatMap, merge as _merge } from 'lodash-es';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { StateService } from '../_core/services/state.service';
import { Team } from '../_shared/models/teams/team';
import { TeamService } from '../_core/services/team.service';
import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { CourseService } from '../_core/services/course.service';
import { Course } from '../_shared/models/course/course';


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

  constructor(public courseService: CourseService,
              public stateService: StateService,
              private playerService: PlayerService,
              private teamService: TeamService) { }

  ngOnInit(): void {
    this.getTeamsAndPlayers();
    this.courseService.getByYear().subscribe(c => {
      this.course = c;
      this.updateCourseHandicapsAndNumShots();
    });
    this.subscriptions.add(this.updateSub.pipe(debounceTime(400)).subscribe(x => this.saveOrUpdateTeam(...x)));
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
        this.updateCourseHandicapsAndNumShots();
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
      this.updateCourseHandicapsAndNumShots();
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

  updateCourseHandicapsAndNumShots(): void {
    if (!this.course || !this.teams) return;
    const slope = this.course.slope / 113;
    const rating = this.course.courseRating - this.course.frontNinePar - this.course.backNinePar;

    this.teams.forEach(t => {
      t.playerA.courseHandicap = -Math.round(-t.playerA.handicap * slope + rating);
      t.playerB.courseHandicap = -Math.round(-t.playerB.handicap * slope + rating);
    });
    const highestCourseHandicap = Math.max(..._flatMap(this.teams.map(t => [t.playerA.courseHandicap, t.playerB.courseHandicap])));
    this.teams.forEach(t => {
      t.playerA.numShots = -(t.playerA.courseHandicap - highestCourseHandicap);
      t.playerB.numShots = -(t.playerB.courseHandicap - highestCourseHandicap);
    });
  }


 // calculateCourseHandicap(handicap, course):


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
      this.updateCourseHandicapsAndNumShots();
      const observables = this.teams.map(t => {
        const update: Partial<Team> = { playerA: t.playerA, playerB: t.playerB };
        return this.teamService.update(t._id, update);
      });
      forkJoin(observables).subscribe();
    }
  }

}
