import { Sorted } from './sorted';

export class SortingTracker {
  [key: string]: Sorted;

  constructor(...keys: string[]) {
   [...keys].forEach(key =>  this[key] = Sorted.false);
  }
}
