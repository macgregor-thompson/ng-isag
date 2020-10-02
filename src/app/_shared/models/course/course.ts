import { NineHoles } from './nine-holes';

export class Course {
  _id: string;
  name = '';
  year: number;
  slope = 140;
  courseRating = 72;
  tees = '';
  frontNine: NineHoles;
  backNine: NineHoles;
  frontNineYards: number;
  backNineYards: number;
  frontNinePar: number;
  backNinePar: number;
  scorecardUrl?: string;
}
