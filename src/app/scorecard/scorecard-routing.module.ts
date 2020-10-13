import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScorecardComponent } from './scorecard.component';

const routes: Routes = [
  { path: '', component: ScorecardComponent, data: {title: 'Scores'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScorecardRoutingModule { }
