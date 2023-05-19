import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Year } from '../_shared/models/years/year';
import { YearService } from '../_core/services/year.service';
import { StateService } from '../_core/services/state.service';
import { PlayerService } from '../_core/services/player.service';
import { TeamService } from '../_core/services/team.service';
import { Team } from '../_shared/models/teams/team';
import { Expense } from '../_shared/models/years/expense';


@Component({
  selector: 'isag-calcutta',
  templateUrl: './calcutta.component.html',
  styleUrls: ['./calcutta.component.scss']
})
export class CalcuttaComponent implements OnInit, OnDestroy {
  teams: Team[];
  playerDues: number;
  totalPLayers: number;
  totalExpenses: number;
  extraPrizes: number;
  totalCalcuttaMoney: number;

  updateSub = new Subject<{ teamId: string, update: Partial<Team> }>();
  subscriptions = new Subscription();

  constructor(public yearService: YearService,
              public stateService: StateService,
              public playerService: PlayerService,
              private teamService: TeamService) {}

  ngOnInit(): void {
    this.subscriptions.add(this.stateService.year$.subscribe({ next: () => this.getTeams() }));
    this.subscriptions.add(this.updateSub.pipe(debounceTime(1000)).subscribe(x => this.updateTeam(x.teamId, x.update)));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getTeams(): void {
    this.teamService.getByYear(this.stateService.year.year).subscribe({
      next: t => {
        this.teams = t;
        this.setMoney();
      }
    });
  }

  setMoney(year: Year = this.stateService.year): void {
    this.totalPLayers = (year.aPlayerIds?.length || 0) + (year.bPlayerIds?.length || 0);
    this.playerDues = year.playerDues * this.totalPLayers;
    this.totalExpenses = year.expenses.reduce((a: number, b: Expense) => a + b.cost, 0);
    this.extraPrizes = year.prizes.reduce((a: number, b: Expense) => a + b.cost, 0);
    this.updatePrizeMoney();

  }

  updatePrizeMoney(): void {
    this.totalCalcuttaMoney = this.teams.reduce((a: number, b: Team) => a + (b.winningBid || 0), 0);
  }

  updateTeam(teamId: string, update: Partial<Team>): void {
    this.teamService.update(teamId, update).subscribe();
  }

}
