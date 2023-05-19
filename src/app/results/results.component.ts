import { Component, OnInit } from '@angular/core';
import { animate, sequence, style, transition, trigger } from '@angular/animations';

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  sortBy as _sortBy, merge as _merge, flow as _flow,
  groupBy as _groupBy, toPairs as _toPairs, reverse as _reverse, map as _map
} from 'lodash-es';

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
import { PlayerScorecard } from '../_shared/models/scorecards/player-scorecard';
import { Expense } from '../_shared/models/years/expense';

@Component({
  selector: 'isag-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
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
export class ResultsComponent implements OnInit {
  scorecards: Scorecard[];
  playerScorecards: PlayerScorecard[];
  teams: Team[];
  course: Course;
  showPlayerScores: { [teamId: string]: boolean } = {};
  firstPlaceTeam: Team;
  secondPlaceTeam: Team;
  thirdPlaceTeam: Team;
  moneyForWinnings: number;


  constructor(public yearService: YearService,
              public stateService: StateService,
              private playerService: PlayerService,
              private teamService: TeamService,
              private courseService: CourseService,
              public dialog: MatDialog,
              private scorecardService: ScorecardService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(year = this.stateService.year.year): void {
    this.getTeams(year);
    this.getCourse(year);
    this.getScorecards(year);
  }

  getScorecards(year = this.stateService.year.year): void {
    this.scorecardService.getByYear(year).subscribe({
      next: scorecards => this.rankAllCards(scorecards)
    });
  }

  getTeams(year = this.stateService.year.year): void {
    this.teamService.getByYear(year).subscribe({
      next: t => {
        this.teams = t;
        this.setMoney();
      }
    });
  }

  getCourse(year = this.stateService.year.year): void {
    this.courseService.getByYear(this.stateService.year.year).subscribe({ next: c => this.course = c });
  }

  setMoney(year: Year = this.stateService.year): void {
    const totalPLayers = (year.aPlayerIds?.length || 0) + (year.bPlayerIds?.length || 0);
    const playerDues = year.playerDues * totalPLayers;
    const totalExpenses = year.expenses.reduce((a: number, b: Expense) => a + b.cost, 0);
    const extraPrizes = year.prizes.reduce((a: number, b: Expense) => a + b.cost, 0);
    const totalCalcuttaMoney = this.teams.reduce((a: number, b: Team) => a + (b.winningBid || 0), 0);
    this.moneyForWinnings = playerDues + totalCalcuttaMoney - totalExpenses - extraPrizes;
  }

  openAddEditScorecardDialog(card?: Scorecard): void {
    const currentCardTeamIds = this.scorecards.map(s => s.teamId);
    const dialogRef = this.dialog.open(AddScorecardDialogComponent, {
      panelClass: 'scorecard-modal',
      data: {
        course: this.course,
        teams: this.teams.filter(t => !currentCardTeamIds.includes(t._id)),
        year: this.stateService.year.year,
        card: card
      }
    });

    dialogRef.afterClosed().subscribe((result: Scorecard) => {
      if (result && result.confirmed) {
        card ? _merge(card, result) : this.scorecards = [...(this.scorecards || []), result];
        if (card?.deleted) {
          this.scorecards = this.scorecards.filter(s => s._id !== result._id);
        }
        this.rankAllCards();
      }
    });
  }

  togglePlayerViews(teamId: string): void {
    this.showPlayerScores[teamId] = !this.showPlayerScores[teamId];
  }

  rankAllCards(cards: Scorecard[] = this.scorecards) {
    this.rankTeamScorecards(cards);
    this.rankPLayerScorecards(cards);
  }

  rankTeamScorecards(cards: Scorecard[] = this.scorecards) {
    cards.forEach(c => {
      c.rank = null;
      c.tied = null;
    });
    const first = this.setPlace(1, cards);
    const second = this.setPlace(2, cards.filter(s => !s.rank));
    const third = this.setPlace(3, cards.filter(s => !s.rank));
    const last = this.setPlace(cards.length, cards.filter(s => !s.rank), true);
    const nonPLaceFinishers = this.rankScorecards(cards.filter(s => !s.rank), 3);
    this.scorecards = [first, second, third, ...(nonPLaceFinishers || []), last].filter(c => !!c);
    this.firstPlaceTeam = first?.team;
    this.secondPlaceTeam = second?.team;
    this.thirdPlaceTeam = third?.team;
  }

  setPlace(place: number, cards: Scorecard[] = this.scorecards, reverse = false): Scorecard {
    if (!cards?.length) return;
    const grouped: Array<Scorecard[]> = this.groupByScore(cards, 'totalNetScore', reverse);
    if (grouped[0].length === 1) {
      grouped[0][0].rank = place;
      return grouped[0][0];

    }

    let ties: Scorecard[] = grouped[0];
    for (let i = 18; i >= 1; i--) {
      ties = this.groupByScore(ties, c => c.teamNetScores[i], reverse)[0];
      if (ties.length === 1) {
        ties[0].rank = place;
        return ties[0];
      }
    }
  }

  groupByScore(cards: Scorecard[], groupBy, reverse = false): Scorecard[][] {
    return _flow([
      function(values) { return _groupBy(values, groupBy); },
      _toPairs,
      function(values) { return _sortBy(values, 0); },
      function(values) { return reverse ? _reverse(values) : values; },
      function(values) { return _map(values, '1'); }
    ])(cards);
  }


  rankPLayerScorecards(scorecards: Scorecard[] = this.scorecards): void {
    const playerCards = [];
    scorecards.forEach(s => {
      playerCards.push(
        new PlayerScorecard(s, 'playerA'),
        new PlayerScorecard(s, 'playerB')
      );
    });
    this.playerScorecards = this.rankScorecards(_sortBy(playerCards, 'totalNetScore'));
  }

  rankScorecards<T extends { rank: number, tied: boolean, totalNetScore: number }>(cards: Array<T>, numPLaces = 0): Array<T> {
    if (!cards?.length) return cards;
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
              cards[h + k].rank = k + 1 + numPLaces;
              cards[k].tied = true;
              cards[h + k].tied = true;
            }
          }
        }
      }
    }
    return cards;
  }


  scoreClass(score: number, par: number): string {
    if (score == null) return '';
    switch (score - par) {
      case -1:
      case -.5:
        return 'birdie';
      case 0:
        return 'par';
      case -2:
      case -1.5:
        return 'eagle';
      case 1:
      case 1.5:
        return 'bogie';
      case 2:
      case 3:
      case 4:
      case 2.5:
      case 3.5:
      case 4.5:
        return 'double-bogie';
      case -3:
      case -4:
      case -2.5:
      case -3.5:
      case -4.5:
        return 'double-eagle';
      default:
        return 'unknown';
    }
  }

  getTotalScore(score: number): string | number {
    if (score < 0) return score;
    if (score === 0) return 'EVEN';
    if (score > 0) return `+${score}`;
  }

}
