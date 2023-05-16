import { Component, OnInit } from '@angular/core';
import { ScorecardService } from '../_core/services/scorecard.service';
import { CourseService } from '../_core/services/course.service';

@Component({
  selector: 'isag-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {


  constructor(public scorecardService: ScorecardService,
              public courseService: CourseService) {}

  ngOnInit() {}


}
