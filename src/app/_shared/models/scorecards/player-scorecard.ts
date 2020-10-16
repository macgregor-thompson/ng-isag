import { Scores } from './scores';
import { Player } from '../player';
import { Scorecard } from './scorecard';

export class PlayerScorecard {
  player: Player;
  netScores: Scores;
  frontNineNetScore: number;
  backNineNetScore: number;
  totalNetScore: number;

  rank: number;
  tied: boolean;

  constructor(card: Scorecard, player: 'playerA' | 'playerB' ) {
    this.player = card.team[player];
    this.netScores = card[`${player}NetScores`];
    this.frontNineNetScore = card[`${player}FrontNineNetScore`];
    this.backNineNetScore = card[`${player}BackNineNetScore`];
    this.totalNetScore = card[`${player}TotalNetScore`];
  }
}
