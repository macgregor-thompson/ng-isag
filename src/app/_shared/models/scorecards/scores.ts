import { Hole } from '../course/hole';

export class Scores {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
  12: number;
  13: number;
  14: number;
  15: number;
  16: number;
  17: number;
  18: number;

  constructor() {
    const holes = Array.from({length: 18}, (_, i) => i + 1);
    holes.forEach(h => this[h] = null);
  }
}
