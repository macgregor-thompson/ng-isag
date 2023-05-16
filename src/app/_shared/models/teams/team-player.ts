import { Player } from '../player';

export class TeamPlayer extends Player {
  playerId: string;
  handicap: number;
  courseHandicap: number;
  playingHandicap: number;
  isPlusHandicap?: boolean;

  constructor(letter: 'A' | 'B') {
    super(letter, 'Player');
  }
}

