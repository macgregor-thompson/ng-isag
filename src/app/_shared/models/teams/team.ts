import { TeamPlayer } from './team-player';

export class Team {
  _id: string;
  year: number;
  playerA: TeamPlayer;
  playerB: TeamPlayer;

  deleted: boolean;
  winningBid: number;
  winningBidder: string;

  constructor(year: number) {
    this.year = year;
    this.playerA = new TeamPlayer('A');
    this.playerB = new TeamPlayer('B');
  }
}
