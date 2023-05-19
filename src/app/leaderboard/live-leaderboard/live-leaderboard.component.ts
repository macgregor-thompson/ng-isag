import { Component, OnDestroy, OnInit } from '@angular/core';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { Course } from '../../_shared/models/course/course';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { partition as _partition } from 'lodash-es';
import { filter, Subscription } from 'rxjs';
import { PairingService } from '../../_core/services/pairing.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'isag-live-leaderboard',
  templateUrl: './live-leaderboard.component.html',
  styleUrls: ['./live-leaderboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LiveLeaderboardComponent implements OnInit, OnDestroy {
  course: Course;
  leaderboard: MatTableDataSource<Scorecard>;

  leaderboardColumns = ['position', 'team', 'playerA', 'playerB', 'totalNet', 'thru'];
  isMobile: boolean;
  isLargeScreen: boolean;
  expandedRows = {};
  leaderboardSub$: Subscription;
  pairingsHaveBeenCreated: boolean;

  constructor(public stateService: StateService,
              public scorecardService: ScorecardService,
              private pairingsService: PairingService) {
    this.isMobile = (window.innerWidth || document.body.clientWidth) < 600;
    this.isLargeScreen = (window.innerWidth || document.body.clientWidth) > 960;
    if (this.isMobile) {
      this.leaderboardColumns = ['position', 'team', 'totalNet', 'thru'];
    } else this.leaderboardColumns = ['position', 'playerA', 'playerB', 'totalNet', 'thru'];
  }

  ngOnInit() {
    this.pairingsService.getByYear().subscribe();
    this.leaderboardSub$ = this.scorecardService.teamScorecards$.pipe(
      tap(cards => {
        if (!cards) {
          this.scorecardService.getLeaderboard().pipe(
            switchMap(c => {
              if (!c?.length) return this.pairingsService.getByYear().pipe(
                filter(p => !!p && !!p.length),
                tap(() => this.pairingsHaveBeenCreated = true)
              );
            })
          ).subscribe();
        }
      }),
      filter(c => !!c)
    ).subscribe({
      next: cards => {
        const rankedCards = this.rankScorecards(cards);
        if (!this.leaderboard) this.leaderboard = new MatTableDataSource<Scorecard>(rankedCards);
        else this.leaderboard.connect().next(rankedCards);
      }
    });
  }

  ngOnDestroy() {
    this.leaderboardSub$.unsubscribe();
  }

  rankScorecards<T extends { rank: number, tied: boolean, totalNetScore: number }>(scorecards: Scorecard[], numPLaces = 0): Scorecard[] {
    const [cards, noScoresYet] = _partition(scorecards, c => c.currentNetToPar);
    if (!cards?.length) return cards;
    for (let i = 0; i < cards.length; i++) {
      cards[i].rank = i + 1 + numPLaces;
      cards[i].tied = false;
    }

    for (let k = 0; k < cards.length; k++) {
      for (let h = 1; h < cards.length + 1; h++) {
        if (cards[k + h] !== undefined) {
          if (cards[k + h].tied !== true) {
            if (cards[k].currentNetToPar === cards[h + k].currentNetToPar) {
              cards[k].rank = k + 1 + numPLaces;
              cards[h + k].rank = k + 1 + numPLaces;
              cards[k].tied = true;
              cards[h + k].tied = true;
            }
          }
        }
      }
    }
    noScoresYet.forEach(c => c.rank = c.teeTime as unknown as number);
    return [...cards, ...noScoresYet];
  }

}
