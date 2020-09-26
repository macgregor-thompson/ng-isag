import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { PlayersComponent } from './players.component';
import { SharedModule } from '../_shared/shared.module';
import { PlayersRoutingModule } from './players-routing.module';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PlayersComponent,
    AddPlayerDialogComponent,
    PlayerDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,

    PlayersRoutingModule,
  ]
})
export class PlayersModule { }
