import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    ResultsRoutingModule
  ]
})
export class ResultsModule { }
