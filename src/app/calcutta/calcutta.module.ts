import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalcuttaRoutingModule } from './calcutta-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { CalcuttaComponent } from './calcutta.component';

@NgModule({
  declarations: [
    CalcuttaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    CalcuttaRoutingModule
  ]
})
export class CalcuttaModule { }
