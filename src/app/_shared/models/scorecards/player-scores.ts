import { Scores } from './scores';
import { ShotsByHole } from './shots-by-hole';
import { Player } from '../player';


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

  // for results only
  player?: Player;

  constructor() {
    this.grossScores = new Scores();
    this.netScores = new Scores();
  }
}
