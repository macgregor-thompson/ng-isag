import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'isag-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent {
  @Input() players: Player[];
  @Input() aOrBPlayersColumn: string;

  @Output() update = new EventEmitter<Player>();

  columns = ['name', 'handicap', 'courseHandicap'];
  _asPLayer(player: Player): Player {
    return player as Player;
  }

}
