import { Pipe, PipeTransform } from '@angular/core';

import { Player } from '../models/player';

@Pipe({
  name: 'filterOutSelectedPlayers'
})
export class FilterOutSelectedPlayersPipe implements PipeTransform {

  transform(players: Player[], playersToFilterOut: Player[]): Player[]   {
  if (!players || !playersToFilterOut) return players;

  const filterIds = playersToFilterOut.map(p => p._id);
  return players.filter(p => !filterIds.includes(p._id));
  }

}
