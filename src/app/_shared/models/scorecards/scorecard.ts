import { Course } from '../course/course';
import { Team } from '../teams/team';
import { Scores } from './scores';

export class Scorecard {
  _id: string;
  year: number;
  courseId: string;
  teamId: string;
  deleted: boolean;

  // rankings
  rank: number;
  tied: boolean;
  place: 1 | 2 | 3;

  // team scores
  teamNetScores: Scores;
  frontNineNetScore: number;
  backNineNetScore: number;
  totalNetScore: number;

  // player A
  playerANetScores: Scores;
  playerAFrontNineNetScore: number;
  playerABackNineNetScore: number;
  playerATotalNetScore: number;

  // player B
  playerBNetScores: Scores;
  playerBFrontNineNetScore: number;
  playerBBackNineNetScore: number;
  playerBTotalNetScore: number;

  // aggregation
  course: Course;
  team: Team;

  constructor(year: number, courseId: string) {
    this.year = year;
    this.courseId = courseId;
    this.playerANetScores = new Scores();
    this.playerBNetScores = new Scores();
    this.teamNetScores = new Scores();

  }
}
