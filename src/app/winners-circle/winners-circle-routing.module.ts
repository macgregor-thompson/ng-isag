import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WinnersCircleComponent } from './winners-circle.component';

const routes: Routes = [
  { path: '', component: WinnersCircleComponent, title: 'Winners Circle' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WinnersCircleRoutingModule { }
