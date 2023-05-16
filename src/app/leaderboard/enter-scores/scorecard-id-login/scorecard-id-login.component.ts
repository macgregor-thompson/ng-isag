import { Component } from '@angular/core';
import { ScorecardService } from '../../../_core/services/scorecard.service';


@Component({
  selector: 'isag-scorecard-id-login',
  templateUrl: './scorecard-id-login.component.html',
  styleUrls: ['./scorecard-id-login.component.scss']
})
export class ScorecardIdLoginComponent {
  scoringId: string;
  noScoringIdFound: boolean;

  constructor(private scorecardService: ScorecardService) {}

  getScorecardByScoringId(): void {
    this.scorecardService.getMyTeamScorecard(this.scoringId).subscribe({
      error: e => {
        this.noScoringIdFound = true;
        console.error(e);
      }
    });
  }
}
