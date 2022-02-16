import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WinnersCircleRoutingModule } from './winners-circle-routing.module';
import { WinnersCircleComponent } from './winners-circle.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [
    WinnersCircleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    WinnersCircleRoutingModule
  ]
})
export class WinnersCircleModule { }
