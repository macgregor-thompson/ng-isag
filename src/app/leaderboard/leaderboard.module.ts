import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard.component';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { EnterScoresComponent } from './enter-scores/enter-scores.component';
import { ScorecardIdLoginComponent } from './enter-scores/scorecard-id-login/scorecard-id-login.component';
import { LiveLeaderboardComponent } from './live-leaderboard/live-leaderboard.component';



@NgModule({
  declarations: [
    LeaderboardComponent,
    EnterScoresComponent,
    ScorecardIdLoginComponent,
    LiveLeaderboardComponent,
  ],
  imports: [
    CommonModule,

    LeaderboardRoutingModule,
    SharedModule
  ]
})
export class LeaderboardModule { }
