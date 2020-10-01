import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'log'
})
export class LogPipe implements PipeTransform {

  transform<T>(values: Array<T>): Array<T> {
    console.log(values);
    return values;
  }

}
