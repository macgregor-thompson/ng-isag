import { Component, OnInit } from '@angular/core';
import { animate, sequence, style, transition, trigger } from '@angular/animations';

import { MatDialog } from '@angular/material/dialog';
import { chain as _chain, sortBy as _sortBy, merge as _merge } from 'lodash';

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
import { Scores } from '../_shared/models/scorecards/scores';
import { PlayerScorecard } from '../_shared/models/scorecards/player-scorecard';

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
  playerScorecards: PlayerScorecard[];
  teams: Team[];
  course: Course;
  showPlayerScores: { [teamId: string]: boolean } = {};
  editRankingId: string;

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
    this.scorecardService.getByYear(this.selectedYear.year).subscribe({
      next: scorecards => {
        this.rankTeamScorecards(scorecards);
        this.rankPLayerScorecards(scorecards);
      }
    });
  }


  getTeams(): void {
    this.teamService.getByYear(this.selectedYear.year).subscribe({ next: t => this.teams = t });
  }

  getCourse(): void {
    this.courseService.getByYear(this.selectedYear.year).subscribe({ next: c => this.course = c });
  }

  openAddEditScorecardDialog(card?: Scorecard): void {
    const dialogRef = this.dialog.open(AddScorecardDialogComponent, {
      panelClass: 'scorecard-modal',
      data: { course: this.course, teams: this.teams, year: this.selectedYear.year, card: card }
    });

    dialogRef.afterClosed().subscribe((result: Scorecard) => {
      if (result) {
        card ? _merge(card, result) : this.scorecards = [...(this.scorecards || []), result];
        if (card.deleted) {
          this.scorecards = this.scorecards.filter(s => s._id !== result._id);
        }
        this.rankTeamScorecards();
        this.rankPLayerScorecards();
      }
    });
  }

  togglePlayerViews(teamId: string): void {
    this.showPlayerScores[teamId] = !this.showPlayerScores[teamId];
  }

  toggleRankEdit(teamId: string): void {
    this.editRankingId = this.editRankingId === teamId ? null : teamId;
  }

  sumHoles(scores: Scores, start: 1 | 10, numHoles: 9 | 18 = 9): number {
    const keys = Array.from({ length: numHoles }, (_, i) => i + start);
    return keys.reduce((a, b) => a + (scores[b] != null || !isNaN(scores[b]) ? scores[b] : 0), 0);
  }

  rankPLayerScorecards(scorecards: Scorecard[] = this.scorecards): void {
    const playerCards = [];
    scorecards.forEach(s => {
      playerCards.push(
        new PlayerScorecard(s.team.playerA, s.playerANetScores,
          this.sumHoles(s.playerANetScores, 1, 9),
          this.sumHoles(s.playerANetScores, 10, 9),
          this.sumHoles(s.playerANetScores, 1, 18)),
        new PlayerScorecard(s.team.playerB, s.playerBNetScores,
          this.sumHoles(s.playerBNetScores, 1, 9),
          this.sumHoles(s.playerBNetScores, 10, 9),
          this.sumHoles(s.playerBNetScores, 1, 18))
      );
    });
    this.playerScorecards = this.rankScorecards(_sortBy(playerCards, 'totalNetScore'));
  }


  rankAllCards() {

  }

  rankTeamScorecards(cards: Scorecard[] = this.scorecards) {
    cards.forEach(c => {
      c.rank = null;
      c.tied = null;
    });
    const first = this.setPlace(1, cards);
    const second = this.setPlace(2, cards.filter(s => !s.rank));
    const third = this.setPlace(3, cards.filter(s => !s.rank));
    const last =  this.setLastPlace(cards.length, cards.filter(s => !s.rank));
    const nonPLaceFinishers = this.rankScorecards(cards.filter(s => !s.rank), 3);
    this.scorecards = [first, second, third, ...nonPLaceFinishers, last];
  }

  setPlace(place: number, cards: Scorecard[] = this.scorecards): Scorecard {
    const grouped: Array<Scorecard[]> = _chain(cards).groupBy('totalNetScore').toPairs().sortBy(0).map(1).value();
    if (grouped[0].length === 1) {
      grouped[0][0].rank = place;
     return grouped[0][0];
    }

    let ties: Scorecard[] = grouped[0];
    for (let i = 18; i >= 1; i--) {
      ties = (_chain(ties).groupBy(c => c.teamNetScores[i]).toPairs().sortBy(0).map(1).value())[0];
      if (ties.length === 1) {
        ties[0].rank = place;
        return ties[0];
      }
    }
  }

  setLastPlace(place: number, cards: Scorecard[] = this.scorecards): Scorecard {
    const grouped: Array<Scorecard[]> = _chain(cards).groupBy('totalNetScore').toPairs().sortBy(0).reverse().map(1).value();
    if (grouped[0].length === 1) return grouped[0][0];

    let ties: Scorecard[] = grouped[0];
    for (let i = 18; i >= 1; i--) {
      ties = (_chain(ties).groupBy(c => c.teamNetScores[i]).toPairs().sortBy(0).reverse().map(1).value())[0];
      if (ties.length === 1) {
        ties[0].rank = place;
        return ties[0];
      }
    }
  }

  rankScorecards<T extends { rank: number, tied: boolean, totalNetScore: number }>(cards: Array<T>, numPLaces = 0): Array<T> {
    for (let i = 0; i < cards.length; i++) {
      cards[i].rank = i + 1 + numPLaces;
      cards[i].tied = false;
    }

    for (let k = 0; k < cards.length; k++) {
      for (let h = 1; h < cards.length + 1; h++) {
        if (cards[k + h] !== undefined) {
          if (cards[k + h].tied !== true) {
            if (cards[k].totalNetScore === cards[h + k].totalNetScore) {
              cards[k].rank = k + 1 + numPLaces;
              cards[h + k].rank = k +  1 + numPLaces;
              cards[k].tied = true;
              cards[h + k].tied = true;
            }
          }
        }
      }
    }
    return cards;
  }

}
