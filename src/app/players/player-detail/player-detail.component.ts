import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';

import { Player } from '../../_shared/models/player';
import { PlayerService } from '../../_core/services/player.service';
import { ConfirmDialogComponent } from '../../_shared/components/confirm-dialog/confirm-dialog.component';
import { StateService } from '../../_core/services/state.service';
import { YearService } from '../../_core/services/year.service';

@Component({
  selector: 'isag-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss']
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  @Input() player: Player;
  @Input() canEdit: boolean;

  @Output() close = new EventEmitter();

  subscriptions = new Subscription();
  updateSub = new Subject<keyof Player>();
  startDate = new Date(1990, 0, 1);


  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               public stateService: StateService,
               private playerService: PlayerService,
               private dialog: MatDialog,
               public yearService: YearService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.updateSub.pipe(debounceTime(400)).subscribe(prop => this.update(prop)));

    this.router.navigate([], { fragment: 'player-detail' });
    this.subscriptions.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => this.activatedRoute.fragment),
      filter(fragment => !fragment)
    ).subscribe(() => this.close.emit()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  deletePlayer() {
    const confirmDeleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Delete ${this.player.firstName}?`,
        okButton: 'Delete',
        okButtonColor: 'warn',
        cancelBtn: 'Cancel'
      },
      panelClass: 'confirm-dialog-container'
    });
    confirmDeleteDialogRef.afterClosed().subscribe(confirm => {
      if (confirm) this.playerService.delete(this.player._id).subscribe(() => this.close.emit());
    });
  }

  update(prop: keyof Player): void {
    if (this.player.firstName?.length && this.player.lastName?.length && this.player.handicap != null) {
      this.playerService.update(this.player._id, { [prop]: this.player[prop]}).subscribe();
    }
  }

}
