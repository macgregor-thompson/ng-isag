import { Pipe, PipeTransform } from '@angular/core';

import { Player } from '../models/player';
import { Year } from '../models/years/year';

@Pipe({
  name: 'filterPlayersByYear'
})
export class FilterPlayersByYearPipe implements PipeTransform {
  transform(players: Player[], year: Year): Player[]   {
    if (!players || !year.year) return players;
    return players.filter(p => year.aPlayerIds.includes(p._id) || year.bPlayerIds.includes(p._id));
  }

}
