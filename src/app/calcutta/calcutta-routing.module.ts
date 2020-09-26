import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalcuttaComponent } from './calcutta.component';

const routes: Routes = [
  { path: '', component: CalcuttaComponent, data: { title: 'Calcutta' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalcuttaRoutingModule { }
