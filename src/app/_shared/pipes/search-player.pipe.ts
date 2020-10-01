import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPlayer'
})
export class SearchPlayerPipe implements PipeTransform {

  transform<T extends {firstName: string, lastName: string}>(list: Array<T>, predicate: string): Array<T> {
    if (!list || !predicate) return list;
    return list.filter(item => {
      const name = `${item.firstName}${item.lastName}`.toLocaleLowerCase();
      return name.includes(predicate.toLocaleLowerCase());
    });
  }

}
