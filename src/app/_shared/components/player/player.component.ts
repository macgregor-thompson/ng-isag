import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from '../../models/player';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'isag-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;
  @Input() index?: number;
  @Input() showAvatars?: false;
  @Input() showCourseHandicap = false;

  @Output() handicapUpdate = new EventEmitter<number>();

  editingHandicap = false;

  constructor() { }

  ngOnInit(): void {
    fromEvent(document, 'click').subscribe(() => this.editingHandicap = false);
  }

}
