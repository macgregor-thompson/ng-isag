import { Team } from './teams/team';
import { Year } from './years/year';

export class Pairing {
  _id: string;
  year: number;
  teamAId: string;
  teamBId: string;
  teeTime: string;
  scoringId: string;
  ordinal: number;

  // aggregations
  teamA: Team;
  teamB: Team;

  constructor([teamA, teamB]: [Team, Team], year: number, ordinal: number) {
    this.teamAId = teamA._id;
    this.teamBId = teamB?._id;
    this.year = year;
    this.ordinal = ordinal;
    this.scoringId = makeScorecardId(3);
  }
}

function makeScorecardId(length): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
