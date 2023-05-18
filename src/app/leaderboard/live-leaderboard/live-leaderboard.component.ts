import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { Course } from '../../_shared/models/course/course';
import { StateService } from '../../_core/services/state.service';
import { ScorecardService } from '../../_core/services/scorecard.service';
import { PlayerScorecard } from '../../_shared/models/scorecards/player-scorecard';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'isag-live-leaderboard',
  templateUrl: './live-leaderboard.component.html',
  styleUrls: ['./live-leaderboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LiveLeaderboardComponent implements OnChanges {
  @Input() teamScorecards: Scorecard[];
  @Input() course: Course;

  leaderboard: MatTableDataSource<Scorecard>;

  showScorecards: { [teamId: string]: boolean } = {};
  leaderboardColumns = ['position', 'team', 'totalNet',  'thru'];
  expandedColumns = [...this.leaderboardColumns, 'expand'];
  expandedScorecard: PlayerScorecard;

  constructor(public stateService: StateService, public scorecardService: ScorecardService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.teamScorecards && !this.leaderboard) this.leaderboard = new MatTableDataSource<Scorecard>(this.teamScorecards);

  }

 /* addData() {
    const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA.length);
    this.dataToDisplay = [...this.dataToDisplay, ELEMENT_DATA[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }*/


  togglePlayerViews(teamId: string): void {
    this.showScorecards[teamId] = !this.showScorecards[teamId];
  }

}
