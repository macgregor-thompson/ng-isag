import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform<T>(values: Array<T>, property: keyof T, ascending = true): Array<T> {
    if (!values || !property) return values;
    return values.sort((a, b) => {
      return ascending ?
        a[property] < b[property] ? -1 : b[property] < a[property] ? 1 : 0
        : b[property] < a[property] ? -1 : a[property] < b[property] ? 1 : 0;
    });
  }

}
