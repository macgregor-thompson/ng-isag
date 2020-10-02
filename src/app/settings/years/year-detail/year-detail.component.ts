import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { uniq as _uniq, chunk as _chunk } from 'lodash';

import { Year } from '../../../_shared/models/year';
import { StateService } from '../../../_core/services/state.service';
import { YearService } from '../../../_core/services/year.service';
import { ConfirmDialogComponent } from '../../../_shared/components/confirm-dialog/confirm-dialog.component';
import { Player } from '../../../_shared/models/player';
import { PlayerService } from '../../../_core/services/player.service';
import { FilterPlayersByYearPipe } from '../../../_shared/pipes/filter-players-by-year.pipe';
import { ConfirmDialogData } from '../../../_shared/models/confirm-dialog-data';
import { OrderByPipe } from '../../../_shared/pipes/order-by.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public stateService: StateService,
              public yearService: YearService,
              public playerService: PlayerService,
              private dialog: MatDialog,
              private filterPlayersByYear: FilterPlayersByYearPipe,
              private orderByPipe: OrderByPipe) { }

  ngOnInit(): void {
    this.router.navigate([], { fragment: 'player-detail' });
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
    this.updatePlayers();
  }

  addPlayers(players: Player[]): void {
    const allPlayers = [...this.aPlayers, ...this.bPlayers, ...players];
    this.splitPLayersByHandicap(allPlayers);
    this.updatePlayers();
  }

  updatePlayers(): void {
    this.year.aPlayerIds = this.aPlayers.map(p => p._id);
    this.year.bPlayerIds = this.bPlayers.map(p => p._id);
    this.yearService.update(this.year._id,
      { aPlayerIds: this.year.aPlayerIds, bPlayerIds: this.year.bPlayerIds }).subscribe();
  }

  splitPLayersByHandicap(players?: Player[]): void {
    const orderedByHandicap = this.orderByPipe.transform(players, 'handicap', false);
    const [aPlayers, bPlayers, oddPlayer] = _chunk(players, (orderedByHandicap.length / 2));
    this.aPlayers = aPlayers;
    this.bPlayers = [...bPlayers, ...(oddPlayer || [])];
    this.allPlayers = [...this.aPlayers, ...this.bPlayers];
  }

  drop(event: CdkDragDrop<Player[]>) {
    if (event.previousContainer !== event.container) {
      console.log(event.previousContainer.data[event.previousIndex]);
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
}
