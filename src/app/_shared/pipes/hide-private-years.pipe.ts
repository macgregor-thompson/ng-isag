import { Pipe, PipeTransform } from '@angular/core';
import { Year } from '../models/years/year';

@Pipe({
  name: 'hidePrivateYears'
})
export class HidePrivateYearsPipe implements PipeTransform {

  transform(years: Year[], isAdmin: boolean): Year[] {
    if (!years || isAdmin) return years;
    return years.filter(y => !!y.public);
  }

}
