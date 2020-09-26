import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { StateService } from '../_core/services/state.service';

@Component({
  selector: 'isag-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  players: Player[];
  selectedPlayer: Player;
  selectedIndex: number;
  subscriptions = new Subscription();

  constructor(private playerService: PlayerService,
              public stateService: StateService,
              public dialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.playerService.getAll().subscribe(p => this.players = p);
  }

  openAddPlayerDialog() {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent, {
      id: 'add-invite-modal',
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((newPlayer: Player) => {
      if (newPlayer) this.players = [...(this.players || []), newPlayer ];
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

  removePLayer() {
    this.closePlayerDetails();
    this.players.splice(this.selectedIndex, 1);
    this.players = this.players.slice();
  }

}
