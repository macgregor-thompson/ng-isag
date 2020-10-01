import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {  filter, switchMap } from 'rxjs/operators';
import { uniq as _uniq } from 'lodash';

import { Year } from '../../../_shared/models/year';
import { StateService } from '../../../_core/services/state.service';
import { YearService } from '../../../_core/services/year.service';
import { ConfirmDialogComponent } from '../../../_shared/components/confirm-dialog/confirm-dialog.component';
import { Player } from '../../../_shared/models/player';
import { PlayerService } from '../../../_core/services/player.service';
import { FilterPlayersByYearPipe } from '../../../_shared/pipes/filter-players-by-year.pipe';
import { ConfirmDialogData } from '../../../_shared/models/confirm-dialog-data';

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
  playersForYear: Player[];

  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               public stateService: StateService,
               public yearService: YearService,
               public playerService: PlayerService,
               private dialog: MatDialog,
               private filterPlayersByYear: FilterPlayersByYearPipe) { }

  ngOnInit(): void {
    this.router.navigate([], { fragment: 'player-detail' });
    this.subscriptions.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => this.activatedRoute.fragment),
      filter(fragment => !fragment)
    ).subscribe(() => this.close.emit()));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.playersForYear = this.filterPlayersByYear.transform(this.playerService.allPlayers, this.year);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  deleteYear() {
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
    const index = this.year.playerIds.findIndex(id => id === player._id);
    this.year.playerIds.splice(index, 1);
    this.updatePlayers();
  }

  addPlayers(players: Player[]): void {
    this.year.playerIds = _uniq([...this.year.playerIds, ...players.map(p => p._id)]);
    this.updatePlayers();
  }

  updatePlayers(): void {
    this.playersForYear = this.filterPlayersByYear.transform(this.playerService.allPlayers, this.year);
    this.yearService.update(this.year._id, { playerIds: this.year.playerIds}).subscribe();
  }
}
