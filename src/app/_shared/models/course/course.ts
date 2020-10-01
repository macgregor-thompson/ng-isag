import { Hole } from './hole';

export class Course {
  _id: string;
  name = '';
  slope = 140;
  courseRating = 72;
  tees = '';
  frontNine: Hole[];
  backNine: Hole[];
  scorecardUrl?: string;
  constructor() {
    this.frontNine = [...Array(9).keys()].map(i => new Hole(i + 1));
    this.backNine = [...Array(9).keys()].map(i => new Hole(i + 10));
  }

}
