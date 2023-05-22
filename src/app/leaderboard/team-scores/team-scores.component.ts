import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NineHoles } from '../../_shared/models/course/nine-holes';
import { setScoreClass } from '../../_shared/helpers/set-score-class';
import { Scores } from '../../_shared/models/scorecards/scores';

@Component({
  selector: '[isag-team-scores]',
  templateUrl: './team-scores.component.html',
  styleUrls: ['./team-scores.component.scss']
})
export class TeamScoresComponent implements OnChanges {
  @Input() netScores: Scores;
  @Input() frontNineNetScore: number;
  @Input() backNineNetScore: number;
  @Input() totalNetScore: number;

  @Input() frontNine: NineHoles;
  @Input() backNine: NineHoles;

  @Input() ranking: string;

  scoreClass: { [key: number]: string } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes.netScores?.currentValue) {
      const allHoles = {...this.frontNine, ...this.backNine};
      Object.keys(allHoles).forEach(holeNum => {
        this.scoreClass[holeNum] = setScoreClass(this.netScores[holeNum], allHoles[holeNum].par);
      });
    }
  }
}
