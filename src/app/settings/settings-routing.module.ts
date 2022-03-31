import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const routes: Routes = [
  { path: ':tab', component: SettingsComponent },
  { path: '', redirectTo: 'years', pathMatch: 'full' },
  { path: '**', redirectTo: 'years', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
