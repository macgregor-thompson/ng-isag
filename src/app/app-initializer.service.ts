import { Injectable } from '@angular/core';

import { Year } from './_shared/models/year';
import { TokenService } from './_core/services/token.service';
import { Player } from './_shared/models/player';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  years: Year[];
  year: Year;

  allPlayers: Player[];

  constructor(private tokenService: TokenService) { }

  async initialize(): Promise<void> {
    const [yearsResp, allPlayersResp] = await Promise.all([
      fetch('api/years'),
      fetch('api/players')
    ]);

    this.years = await yearsResp.json();
    //this.year = this.years.reduce((prev, current) => (prev.year > current.year) ? prev : current);
    this.year = this.years.find(y => y.current);

    this.allPlayers = await allPlayersResp.json();
  }
}
