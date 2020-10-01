import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByName'
})
export class SortByNamePipe implements PipeTransform {

  transform<T extends {firstName: string, lastName: string}>(list: Array<T>, ascending = true): Array<T> {
    if (!list) return list;
    return list.sort((a, b) => {
      const personA = `${a.firstName}${a.lastName}`.toLocaleLowerCase() || 0;
      const personB = `${b.firstName}${b.lastName}`.toLocaleLowerCase() || 0;
      return ascending ?
        personA < personB ? -1 : personB < personA ? 1 : 0
        : personB < personA ? -1 : personA < personB ? 1 : 0;
    });
  }

}
