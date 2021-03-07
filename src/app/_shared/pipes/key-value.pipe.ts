import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue'
})
export class KeyValuePipe implements PipeTransform {

  transform(obj: object, args?: string[]): KeyValueObj[] {
    const keyValuePairsArr = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        keyValuePairsArr.push({key, value: obj[key]});
      }
    }
    return keyValuePairsArr;
  }

}

export interface KeyValueObj {
  key: string;
  value: any;
}
