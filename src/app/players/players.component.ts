import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { StateService } from '../_core/services/state.service';
import { YearService } from '../_core/services/year.service';
import { SpinnerService } from '../_core/services/spinner.service';
import { Year } from '../_shared/models/years/year';

@Component({
  selector: 'isag-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  selectedPlayer: Player;
  selectedIndex: number;
  subscriptions = new Subscription();
  yearAll = { _id: 'all', year: 0 };
  selectedYear = this.yearAll as Year;

  constructor(public playerService: PlayerService,
              public stateService: StateService,
              public dialog: MatDialog,
              private router: Router,
              public yearService: YearService,
              private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
  }

  openAddPlayerDialog() {
    this.dialog.open(AddPlayerDialogComponent, {
      id: 'add-invite-modal',
      width: '650px',
    });
  }

  selectPlayer(player: Player, i: number) {
    this.selectedPlayer = player;
    this.selectedIndex = i;
  }

  closePlayerDetails() {
    this.selectedPlayer = null;
   this.router.navigate([]);
  }

  yearsAreSame(option, value): boolean {
    return option._id === value._id;
  }

}
