import { Component, Input, OnInit } from '@angular/core';
import { Scorecard } from '../../models/scorecards/scorecard';

@Component({
  selector: 'isag-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss']
})
export class ScorecardComponent implements OnInit {
  @Input() scorecard: Scorecard[];
  displayedColumns = [
    'Hole', 1, 2, 3, 4, 5, 6, 7, 8, 9, 'Out',
    10, 11, 12, 13, 14, 15, 16, 17, 18, 'In', 'Total'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
