import { TeamPlayer } from './team-player';
import { Player } from '../player';

export class Team {
  _id: string;
  year: number;
  playerA: TeamPlayer;
  playerADetails: Player;
  playerB: TeamPlayer;
  playerBDetails: Player;

  deleted: boolean;
  winningBid: number;
  winningBidder: string;

  constructor(year: number) {
    this.year = year;
    this.playerA = new TeamPlayer('A');
    this.playerB = new TeamPlayer('B');
  }
}
