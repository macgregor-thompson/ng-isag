import { Component, Inject, OnInit } from '@angular/core';

import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { every as _every } from 'lodash-es';

import { Course } from '../../_shared/models/course/course';
import { Scorecard } from '../../_shared/models/scorecards/scorecard';
import { Team } from '../../_shared/models/teams/team';
import { Scores } from '../../_shared/models/scorecards/scores';
import { ScorecardService } from '../../_core/services/scorecard.service';

@Component({
  selector: 'isag-add-scorecard-dialog',
  templateUrl: './add-scorecard-dialog.component.html',
  styleUrls: ['./add-scorecard-dialog.component.scss']
})
export class AddScorecardDialogComponent implements OnInit {
  spinner: false;
  card: Scorecard;
  frontNine = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Out'];
  backNine = ['10', '11', '12', '13', '14', '15', '16', '17', '18', 'In', 'Total'];

  constructor(public dialogRef: MatDialogRef<AddScorecardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { course: Course, year: number, teams: Team[], card?: Scorecard },
              private scorecardService: ScorecardService) {
    this.card = data.card ? data.card : new Scorecard(data.year, data.course);
  }

  ngOnInit(): void {
  }

  sumHoles(scores: Scores, start: 1 | 10, numHoles: 9 | 18 = 9): number {
    const keys =  Array.from({length: numHoles}, (_, i) => i + start);
    return keys.reduce((a, b) => a + (scores[b] != null || !isNaN(scores[b]) ? scores[b] : 0), 0);
  }

  canSave(): boolean {
    return this.card.teamId && _every(this.card.teamNetScores, s => s != null);
  }

  teamsAreSame(option, value): boolean {
    return option?._id === value?._id;
  }

  setTeamId(team: Team): void {
    this.card.teamId = team._id;
  }

  setCardScores(): void {
    this.card.frontNineNetScore = this.sumHoles(this.card.teamNetScores, 1, 9);
    this.card.backNineNetScore = this.sumHoles(this.card.teamNetScores, 10, 9);
    this.card.totalNetScore = this.card.frontNineNetScore + this.card.backNineNetScore;
    this.card.playerAScores.frontNineGrossScore = this.sumHoles(this.card.playerAScores.grossScores, 1, 9);
    this.card.playerAScores.backNineGrossScore = this.sumHoles(this.card.playerAScores.grossScores, 10, 9);
    this.card.playerAScores.totalGrossScore = this.sumHoles(this.card.playerAScores.grossScores, 1, 18);
    // playerBScores.totalNetScore
    this.card.playerBScores.frontNineGrossScore = this.sumHoles(this.card.playerBScores.grossScores, 1, 9);
    this.card.playerBScores.backNineGrossScore = this.sumHoles(this.card.playerBScores.grossScores, 1, 9);
    this.card.playerBScores.totalGrossScore = this.sumHoles(this.card.playerBScores.grossScores, 1, 9);
  }

  addScorecard(): void {
    this.setCardScores();
    if (this.card._id) {
      this.scorecardService.update(this.card._id, this.card).subscribe({
        next: card => this.dialogRef.close({ ...card })
      });
    } else {
      this.scorecardService.create(this.card).subscribe({
        next: card => this.dialogRef.close({ ...card, team: this.card.team })
      });
    }
  }

  delete(): void {
    this.card.deleted = true;
    this.scorecardService.delete(this.card._id).subscribe({
      next: () => this.dialogRef.close(this.card)
    });
  }



}
