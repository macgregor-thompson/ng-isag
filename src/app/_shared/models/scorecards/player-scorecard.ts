import { Scores } from './scores';
import { Player } from '../player';

export class PlayerScorecard {
  player: Player;
  netScores: Scores;
  frontNineNetScore: number;
  backNineNetScore: number;
  totalNetScore: number;

  rank: number;
  tied: boolean;

  constructor(player: Player, netScores: Scores, frontNineNetScore: number, backNineNetScore: number, totalNetScore: number) {
    this.player = player;
    this.netScores = netScores;
    this.frontNineNetScore = frontNineNetScore;
    this.backNineNetScore = backNineNetScore;
    this.totalNetScore = totalNetScore;
  }
}
