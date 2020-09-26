import { Injectable } from '@angular/core';

import { Year } from './_shared/models/year';
import { TokenService } from './_core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  years: Year[];

  constructor(private tokenService: TokenService) { }

  async initialize(): Promise<void> {
    const [yearsResp] = await Promise.all([
      fetch('api/years'),
    ]);

    this.years = await yearsResp.json();
  }
}
