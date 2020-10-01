import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absoluteValue'
})
export class AbsoluteValuePipe implements PipeTransform {

  transform(number: number): number {
    if (isNaN(number)) return null;
    return Math.abs(number);
  }

}
