import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScorecardRoutingModule } from './scorecard-routing.module';
import { ScorecardComponent } from './scorecard.component';
import { SharedModule } from '../_shared/shared.module';
import { AddScorecardDialogComponent } from './add-scorecard-dialog/add-scorecard-dialog.component';


@NgModule({
  declarations: [ScorecardComponent, AddScorecardDialogComponent],
  imports: [
    CommonModule,
    SharedModule,

    ScorecardRoutingModule
  ]
})
export class ScorecardModule { }
