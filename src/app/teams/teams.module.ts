import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [TeamsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    TeamsRoutingModule
  ]
})
export class TeamsModule { }
