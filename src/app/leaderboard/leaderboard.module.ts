import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard.component';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { SharedModule } from '../_shared/shared.module';



@NgModule({
  declarations: [
    LeaderboardComponent
  ],
  imports: [
    CommonModule,

    LeaderboardRoutingModule,
    SharedModule
  ]
})
export class LeaderboardModule { }
