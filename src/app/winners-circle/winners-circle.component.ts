import { Component, OnInit } from '@angular/core';
import { Player } from '../_shared/models/player';
import { PlayerService } from '../_core/services/player.service';
import { SpinnerService } from '../_core/services/spinner.service';

@Component({
  selector: 'isag-winners-circle',
  templateUrl: './winners-circle.component.html',
  styleUrls: ['./winners-circle.component.scss']
})
export class WinnersCircleComponent implements OnInit {

  winners: Player[];

  constructor(private playerService: PlayerService,
              private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.stop();
    this.winners = this.playerService.allPlayers
      .filter(p => !!p.yearsWon?.length)
      .sort((a, b) => {
        const personA = `${a.firstName}${a.lastName}`.toLocaleLowerCase() || 0;
        const personB = `${b.firstName}${b.lastName}`.toLocaleLowerCase() || 0;
        return personA < personB ? -1 : personB < personA ? 1 : 0;
      })
      .sort((a, b) => b.yearsWon.length - a.yearsWon.length);
  }

}
