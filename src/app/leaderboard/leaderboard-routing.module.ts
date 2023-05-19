import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './leaderboard.component';


const routes: Routes = [
  { path: ':tab', component: LeaderboardComponent },
  { path: '', redirectTo: 'live', pathMatch: 'full' },
  { path: '**', redirectTo: 'live', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule {
}
