import { Component, Input, OnInit } from '@angular/core';

import { Player } from '../../models/player';

@Component({
  selector: 'isag-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit(): void {
  }

}
