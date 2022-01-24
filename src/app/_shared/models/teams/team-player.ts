import { Player } from '../player';

export class TeamPlayer extends Player {
  playerId: string;
  handicap: number;
  courseHandicap: number;
  numShots: number;

  constructor(letter: 'A' | 'B') {
    super(letter, 'Player');
  }
}

