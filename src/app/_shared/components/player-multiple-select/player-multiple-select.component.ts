import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { isEmpty as _isEmpty, cloneDeep as _cloneDeep } from 'lodash';

import { Player } from '../../models/player';
import { PlayerService } from '../../../_core/services/player.service';
import { StateService } from '../../../_core/services/state.service';

@Component({
  selector: 'isag-player-multiple-select',
  templateUrl: './player-multiple-select.component.html',
  styleUrls: ['./player-multiple-select.component.scss']
})
export class PlayerMultipleSelectComponent implements OnInit {
  @Input() players?: Player[];
  @Input() playersToFilterOut?: Player[];

  @Output() selectPlayers = new EventEmitter<Player[]>();

  selectedPlayers: {[playerId: string]: Player} = {};

  @HostListener('click', ['$event'])
  @HostListener('mousedown', ['$event'])
  onClick(e) {
    e.stopPropagation();
  }

  constructor(public playerService: PlayerService,
              public stateService: StateService) { }

  ngOnInit(): void {}

  onSelect(p: Player): void {
    if (this.selectedPlayers[p._id]) {
      delete this.selectedPlayers[p._id];
    } else {
      this.selectedPlayers[p._id] = p;
    }
  }

  disableSave(): boolean {
    return _isEmpty(this.selectedPlayers);
  }

  onSelectPlayers(): void {
    const playerIds = Object.keys(this.selectedPlayers);
    this.selectPlayers.emit(this.playerService.allPlayers.filter(p => playerIds.includes(p._id)));
    this.selectedPlayers = {};
  }

}
