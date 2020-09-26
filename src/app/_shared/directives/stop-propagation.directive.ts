import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[isagStopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('click', ['$event'])
  onClick(e) {
    e.stopPropagation();
  }

}
