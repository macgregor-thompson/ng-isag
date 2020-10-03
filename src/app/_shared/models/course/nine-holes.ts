import { Hole } from './hole';

export class NineHoles {
  [hole: string]: Hole;
  constructor(start: 1 | 10) {
    const holes = Array.from({length: 9}, (_, i) => i + start);
    holes.forEach(h => this[h] = new Hole());
  }
}
