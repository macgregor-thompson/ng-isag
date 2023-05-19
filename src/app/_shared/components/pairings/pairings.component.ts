import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Pairing } from '../../models/pairing';
import { PairingService } from '../../../_core/services/pairing.service';
import { StateService } from '../../../_core/services/state.service';
import { CourseService } from '../../../_core/services/course.service';
import { ScorecardService } from '../../../_core/services/scorecard.service';

@Component({
  selector: 'isag-pairings',
  templateUrl: './pairings.component.html',
  styleUrls: ['./pairings.component.scss']
})
export class PairingsComponent implements OnInit, OnChanges {

  @Input() pairings?: Pairing[];

  pairingsData: MatTableDataSource<Pairing>;
  columns = ['teeTime', 'aPlayer', 'aPlayerHandicap', 'bPlayer', 'bPlayerHandicap'];

  constructor(public pairingService: PairingService, public stateService: StateService, private scorecardService: ScorecardService) {}

  ngOnInit() {
    if (!this.pairings) {
      this.pairingService.getByYear().subscribe({
        next: pairings => {
          this.pairings = pairings;
          this.pairingsData = new MatTableDataSource<Pairing>(pairings);
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.pairings) this.pairingsData = new MatTableDataSource<Pairing>(this.pairings);
  }


  updateTeeTime({ _id, teeTime, teamAId, teamBId }: Pairing) {
    this.pairingService.update(_id, { teeTime }).subscribe();
    this.scorecardService.updateTeeTimes({ teamIds: [teamAId, teamBId], teeTime }).subscribe();
  }

}
