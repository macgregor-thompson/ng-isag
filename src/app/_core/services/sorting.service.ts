import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Sorted } from '../../_shared/models/_shared/sorted';
import { SortingTracker } from '../../_shared/models/_shared/sorting-tracker';
import { Player } from '../../_shared/models/player';

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  static changeSortDirection(sorter: SortingTracker, property: string, direction?: Sorted): void {
    if (direction) {
      sorter[property] = direction;
    } else if (sorter[property] === Sorted.descending) {
      sorter[property] = Sorted.false;
    } else {
      sorter[property]++;
    }
  }


  constructor() { }

  sortAlphabetically<T>(list: Array<T>, property: string, sortOrder: Sorted): Observable<Array<T>> {
    const ascending = sortOrder === Sorted.ascending;
    return of(list.sort((a, b) => {
      const stringA = a[property].toLocaleLowerCase();
      const stringB = b[property].toLocaleLowerCase();
      return ascending ?
        stringA < stringB ? -1 : stringB < stringA ? 1 : 0
        : stringB < stringA ? -1 : stringA < stringB ? 1 : 0;
    }));
  }

  // is there way to say <T extends  {[keyof T]]: User}>
  sortByPlayerName(players: Player[],  sortOrder: Sorted, ): Player[] {
    return players.sort((a, b) => {
      const playerA = `${a.firstName}${a.lastName}`.toLocaleLowerCase() || 0;
      const playerB = `${b.firstName}${b.lastName}`.toLocaleLowerCase() || 0;
      return sortOrder === Sorted.ascending ?
        playerA < playerB ? -1 : playerB < playerA ? 1 : 0
        : playerB < playerA ? -1 : playerA < playerB ? 1 : 0;
    });
  }

  sortByDate<T>(list: Array<T>, property: string, sortOrder: Sorted): Observable<Array<T>> {
    return of(list.sort((a, b) => {
      // @ts-ignore
      const dateA = a[property] ? new Date(a[property]).getTime() : 0;
      // @ts-ignore
      const dateB = b[property] ? new Date(b[property]).getTime() : 0;
      return sortOrder === Sorted.ascending ? dateA - dateB : dateB - dateA;
    }));
  }

  sortByProperty<T>(list: Array<T>, property: string, sortOrder: Sorted): Observable<Array<T>> {
    return of(list.sort((a, b) => {
      const propA = a[property];
      const propB = b[property];
      return sortOrder === Sorted.ascending ?
        propA < propB ? -1 : propB < propA ? 1 : 0
        : propB < propA ? -1 : propA < propB ? 1 : 0;
    }));
  }

  sortByNumber<T>(list: Array<T>, property: string, sortOrder: Sorted): Observable<Array<T>> {
    return of(list.sort((a, b) => {
      const numA = a[property] ? parseInt(a[property], 10) : Number.NEGATIVE_INFINITY;
      const numB = b[property] ? parseInt(b[property], 10) :  Number.NEGATIVE_INFINITY;
      return sortOrder === Sorted.ascending ?
        numA < numB ? -1 : numB < numA ? 1 : 0
        : numB < numA ? -1 : numA < numB ? 1 : 0;
    }));
  }

}


export enum SortingServiceMethod {
  sortAlphabetically = 'sortAlphabetically',
  sortByPlayerName = 'sortByPlayerName',
  sortByDate = 'sortByDate',
  sortByProperty = 'sortByProperty'
}

