import { Injectable } from '@angular/core';

import { Year } from './_shared/models/years/year';
import { Player } from './_shared/models/player';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  years: Year[];
  year: Year;

  allPlayers: Player[];

  constructor() { }

  async initialize(): Promise<void> {
    const [yearsResp, allPlayersResp] = await Promise.all([
      fetch('api/years'),
      fetch('api/players')
    ]);

    this.years = await yearsResp.json();
    const params = new URLSearchParams(window.location.search);
    const queryYear = params.get('year');
    const year = queryYear ? this.years.find(y => y.year === parseInt(queryYear, 10)) : null;
    this.year = year || this.years.find(y => y.current)
      || this.years.reduce((prev, current) => (prev?.year > current?.year) ? prev : current);

    this.allPlayers = await allPlayersResp.json();
  }
}
