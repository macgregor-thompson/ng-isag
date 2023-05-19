import { Scores } from './scores';
import { ShotsByHole } from './shots-by-hole';
import { Course } from '../course/course';


export class PlayerScores {
  grossScores: Scores;
  frontNineGrossScore: number;
  backNineGrossScore: number;
  totalGrossScore: number;

  netScores: Scores;
  frontNineNetScore: number;
  backNineNetScore: number;
  totalNetScore: number;

  courseHandicap: number;
  playingHandicap: number;

  shotsByHole: ShotsByHole;

  constructor(course: Course) {
    this.grossScores = new Scores();
    this.netScores = new Scores();


  }
}
