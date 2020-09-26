import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RulesRoutingModule } from './rules-routing.module';
import { RulesComponent } from './rules.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [RulesComponent],
  imports: [
    CommonModule,
    SharedModule,

    RulesRoutingModule
  ]
})
export class RulesModule { }
