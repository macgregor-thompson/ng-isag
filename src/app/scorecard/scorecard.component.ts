import { Component, OnInit } from '@angular/core';
import { animate, sequence, style, transition, trigger } from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';

import { Year } from '../_shared/models/years/year';
import { YearService } from '../_core/services/year.service';
import { StateService } from '../_core/services/state.service';
import { PlayerService } from '../_core/services/player.service';
import { TeamService } from '../_core/services/team.service';
import { Scorecard } from '../_shared/models/scorecards/scorecard';
import { Team } from '../_shared/models/teams/team';
import { CourseService } from '../_core/services/course.service';
import { Course } from '../_shared/models/course/course';
import { AddScorecardDialogComponent } from './add-scorecard-dialog/add-scorecard-dialog.component';
import { ScorecardService } from '../_core/services/scorecard.service';

@Component({
  selector: 'isag-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss'],
  animations: [
    trigger('rowsAnimation', [
      transition('void => *', [
        style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
        sequence([
          animate('.25s ease', style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none' })),
          animate('.25s ease', style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
        ])
      ])
    ])
  ]
})
export class ScorecardComponent implements OnInit {
  selectedYear: Year;
  scorecards: Scorecard[];
  teams: Team[];
  course: Course;
  showPlayerScores: { [teamId: string]: boolean } = {};

  constructor(public yearService: YearService,
              public stateService: StateService,
              private playerService: PlayerService,
              private teamService: TeamService,
              private courseService: CourseService,
              public dialog: MatDialog,
              private scorecardService: ScorecardService) {
    this.selectedYear = this.stateService.year;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.getTeams();
    this.getCourse();
    this.getScorecards();
  }

  getScorecards(): void {
    this.scorecardService.getByYear(this.selectedYear.year).subscribe({ next: s => this.scorecards = s });
  }

  getTeams(): void {
    this.teamService.getByYear(this.selectedYear.year).subscribe({ next: t => this.teams = t });
  }

  getCourse(): void {
    this.courseService.getByYear(this.selectedYear.year).subscribe({ next: c => this.course = c });
  }

  openAddScorecardDialog(): void {
    const dialogRef = this.dialog.open(AddScorecardDialogComponent, {
      panelClass: 'scorecard-modal',
      data: { course: this.course, teams: this.teams, year: this.selectedYear.year }
    });

    dialogRef.afterClosed().subscribe((newScorecard: Scorecard) => {
      if (newScorecard) this.scorecards = [...(this.scorecards || []), newScorecard];
    });
  }

  togglePlayerViews(teamId: string): void {
    this.showPlayerScores[teamId] = !this.showPlayerScores[teamId];
  }

}
