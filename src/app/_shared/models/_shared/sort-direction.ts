import { Sorted } from './sorted';

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export function sortDirectionToSorted(sortDirection: SortDirection): Sorted {
    switch (sortDirection) {
      case SortDirection.ASC:
        return Sorted.ascending;
      case SortDirection.DESC:
        return Sorted.descending;
      default: //null
        return Sorted.false;
    }
}
