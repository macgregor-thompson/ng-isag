import { Scores } from './scores';

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

  constructor() {
    this.grossScores = new Scores();
    this.netScores = new Scores();
  }
}
