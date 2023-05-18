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
  }
}
