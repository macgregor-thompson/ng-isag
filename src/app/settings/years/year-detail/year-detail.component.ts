import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { chunk as _chunk, partition as _partition } from 'lodash-es';

import { Year } from '../../../_shared/models/years/year';
import { StateService } from '../../../_core/services/state.service';
import { YearService } from '../../../_core/services/year.service';
import { ConfirmDialogComponent } from '../../../_shared/components/confirm-dialog/confirm-dialog.component';
import { Player } from '../../../_shared/models/player';
import { PlayerService } from '../../../_core/services/player.service';
import { FilterPlayersByYearPipe } from '../../../_shared/pipes/filter-players-by-year.pipe';
import { ConfirmDialogData } from '../../../_shared/models/confirm-dialog-data';
import { OrderByPipe } from '../../../_shared/pipes/order-by.pipe';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Expense } from '../../../_shared/models/years/expense';

@Component({
  selector: 'isag-year-detail',
  templateUrl: './year-detail.component.html',
  styleUrls: ['./year-detail.component.scss']
})
export class YearDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() year: Year;

  @Output() close = new EventEmitter();

  spinner = false;
  subscriptions = new Subscription();
  aPlayers: Player[];
  bPlayers: Player[];
  allPlayers: Player[];
  updateSub = new Subject<keyof Year>();
  updatePrizeOrExpenseSub = new Subject<[number, 'expenses' | 'prizes']>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public stateService: StateService,
              public yearService: YearService,
              public playerService: PlayerService,
              private dialog: MatDialog,
              private filterPlayersByYear: FilterPlayersByYearPipe,
              private orderByPipe: OrderByPipe) { }

  ngOnInit(): void {
    this.subscriptions.add(this.updateSub.pipe(debounceTime(400)).subscribe(prop => this.update(prop)));
    this.subscriptions.add(this.updatePrizeOrExpenseSub.pipe(debounceTime(400))
      .subscribe(x => this.updatePrizesOrExpenses(...x)));

    this.router.navigate([], { fragment: 'year-detail' });
    this.subscriptions.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => this.activatedRoute.fragment),
      filter(fragment => !fragment)
    ).subscribe(() => this.close.emit()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    [this.aPlayers, this.bPlayers] = this.playerService.aAndBPlayers(this.year);
    this.allPlayers = [...this.aPlayers, ...this.bPlayers];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  deleteYear(): void {
    const data: ConfirmDialogData = {
      title: `Delete ${this.year.year}?`,
      message: 'This action CANNOT be undone',
      okButton: 'Delete',
      cancelButton: 'Cancel'
    };
    const confirmDeleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      panelClass: 'confirm-dialog-container'
    });
    confirmDeleteDialogRef.afterClosed().subscribe(confirm => {
      if (confirm) this.yearService.delete(this.year._id).subscribe(() => this.close.emit());
    });
  }

  deletePlayer(player: Player): void {
    this.aPlayers = this.aPlayers.filter(p => p._id !== player._id);
    this.bPlayers = this.bPlayers.filter(p => p._id !== player._id);
    this.splitPLayersByHandicap([...this.aPlayers, ...this.bPlayers]);
    this.updateAAndBPlayers();
  }

  addPlayers(players: Player[]): void {
    const allPlayers = [...this.aPlayers, ...this.bPlayers, ...players];
    this.splitPLayersByHandicap(allPlayers);
    this.updateAAndBPlayers();
  }

  sortPlayersByHandicap(): void {
    this.splitPLayersByHandicap();
    this.updateAAndBPlayers();
  }

  updateAAndBPlayers(): void {
    this.year.aPlayerIds = this.aPlayers.map(p => p._id);
    this.year.bPlayerIds = this.bPlayers.map(p => p._id);
    this.yearService.update(this.year._id,
      { aPlayerIds: this.year.aPlayerIds, bPlayerIds: this.year.bPlayerIds }).subscribe();
  }

  splitPLayersByHandicap(players: Player[] = [...this.bPlayers, ...this.aPlayers, ]): void {
    const [playersWithHandicaps, playersWithoutHandicaps] = _partition(players, p => p.handicap != null);
    const orderedByHandicap = this.orderByPipe.transform(playersWithHandicaps, 'handicap', false);
    const allPlayers = [...orderedByHandicap, ...playersWithoutHandicaps];
    const chunkSize = allPlayers.length > 1 ? allPlayers.length / 2 : 1;
    const [aPlayers = [], bPlayers = [], oddPlayer = []] = _chunk(allPlayers, chunkSize);
    this.aPlayers = aPlayers;
    this.bPlayers = [...bPlayers, ...oddPlayer];
    this.allPlayers = [...this.aPlayers, ...this.bPlayers];
  }

  dropPlayer(event: CdkDragDrop<Player[]>) {
    if (event.previousContainer !== event.container) {
      const index = event.container.id === 'aPlayers' ? this.aPlayers.length - 1 : 0;
      const player = event.container.data.splice(index, 1)[0];

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.previousContainer.data.push(player);
    }
    this.aPlayers = this.aPlayers.slice(0);
    this.bPlayers = this.bPlayers.slice(0);
  }

  addPrizeOrExpense(list: 'prizes' | 'expenses'): void {
    this.year[list].push(new Expense());
  }

  update(prop: keyof Year): void {
    this.yearService.update(this.year._id, { [prop]: this.year[prop] }).subscribe();
  }

  deletePrizeOrExpense(i: number, list: 'prizes' | 'expenses'): void {
    this.year[list].splice(i, 1);
    this.update(list);
  }

  updateHandicap(playerId: string, handicap: number): void {
    this.playerService.update(playerId, {handicap}).subscribe();
    this.sortPlayersByHandicap();
  }

  updatePrizesOrExpenses(i: number, list: 'prizes' | 'expenses'): void {
    if (this.year.expenses[i].name?.length && this.year.expenses[i].cost != null) {
      const filtered = this.year[list].filter(e => !!e.name.length && e.cost != null);
      this.yearService.update(this.year._id, { [list]: filtered }).subscribe();
    }
  }
}
