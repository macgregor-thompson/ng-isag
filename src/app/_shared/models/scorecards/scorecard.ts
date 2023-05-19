import { Course } from '../course/course';
import { Team } from '../teams/team';
import { Scores } from './scores';
import { PlayerScores } from './player-scores';

export class Scorecard {
  _id: string;
  scoringId: string;

  year: number;
  courseId: string;
  teamId: string;
  deleted: boolean;

  // rankings
  rank: number;
  tied: boolean;

  playerAScores: PlayerScores;
  playerBScores: PlayerScores;

  // team scores
  teamNetScores: Scores;
  frontNineNetScore: number;
  backNineNetScore: number;
  totalNetScore: number;

  confirmed: boolean;

  // for active leaderboard
  currentNetToPar: number;
  thru: number;
  teeTime?: string;

  // aggregation
  course?: Course;
  team?: Team;

  constructor(year: number, course: Course) {
    this.year = year;
    this.courseId = course._id;
    this.teamNetScores = new Scores();
    this.playerAScores = new PlayerScores(course);
    this.playerBScores = new PlayerScores(course);

  }
}
