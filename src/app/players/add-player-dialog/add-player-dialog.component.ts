import { Component, OnInit } from '@angular/core';

import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { Player } from '../../_shared/models/player';
import { PlayerService } from '../../_core/services/player.service';

@Component({
  selector: 'isag-add-player-dialog',
  templateUrl: './add-player-dialog.component.html',
  styleUrls: ['./add-player-dialog.component.scss']
})
export class AddPlayerDialogComponent implements OnInit {
  player = new Player();
  spinner = false;

  constructor(public dialogRef: MatDialogRef<AddPlayerDialogComponent>,
              private playerService: PlayerService) { }

  ngOnInit(): void {}

  addPlayer(): void {
    this.spinner = true;
    this.playerService.create(this.player).subscribe({
      next: () => this.dialogRef.close(),
      error: () => this.spinner = false
    });
  }

}
