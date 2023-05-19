import { NineHoles } from './nine-holes';
import { Hole } from './hole';

export class Course {
  _id: string;
  name = '';
  year: number;
  slope: number;
  courseRating: number;
  tees = '';
  frontNine: NineHoles;
  backNine: NineHoles;
  frontNineYards: number;
  backNineYards: number;
  frontNinePar: number;
  backNinePar: number;
  scorecardUrl?: string;
  deleted: boolean;

  constructor() {
    this.frontNine = new NineHoles(1);
    this.backNine = new NineHoles(10);
  }
}
