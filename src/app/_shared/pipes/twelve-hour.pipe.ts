import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twelveHour'
})
export class TwelveHourPipe implements PipeTransform {
  transform(time: any): string {
    if (!time) return '';
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    const part = hour > 12 ? 'pm' : 'am';
    if (parseInt(hour, 10) === 0)
      hour = 12;
    min = (min + '').length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length === 1 ? `${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }

}
