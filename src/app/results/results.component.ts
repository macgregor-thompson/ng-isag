import { Component, OnInit } from '@angular/core';

import { YearService } from '../_core/services/year.service';
import { Player } from '../_shared/models/player';
import { Year } from '../_shared/models/year';
import { StateService } from '../_core/services/state.service';

@Component({
  selector: 'isag-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: Array<Year & {players: Player[]}>;

  constructor(public yearService: YearService,
              public stateService: StateService) {
  }

  ngOnInit(): void {
    this.yearService.getYearWithPlayers().subscribe(results => this.results = results);
  }

}
