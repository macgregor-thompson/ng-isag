import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayerScores } from '../../_shared/models/scorecards/player-scores';
import { NineHoles } from '../../_shared/models/course/nine-holes';
import { setScoreClass } from '../../_shared/helpers/set-score-class';
import { Course } from '../../_shared/models/course/course';

@Component({
  selector: '[isag-player-scores]',
  templateUrl: './player-scores.component.html',
  styleUrls: ['./player-scores.component.scss']
})
export class PlayerScoresComponent implements OnChanges {
  @Input() name: string;
  @Input() scores: PlayerScores;
  @Input() frontNine: NineHoles;
  @Input() backNine: NineHoles;

  scoreClass: { [key: number]: string } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes.scores?.currentValue) {
      const allHoles = { ...this.frontNine, ...this.backNine };
      Object.keys(allHoles).forEach(holeNum => {
        this.scoreClass[holeNum] = setScoreClass(this.scores.netScores[holeNum], allHoles[holeNum].par);
      });
    }
  }


}
