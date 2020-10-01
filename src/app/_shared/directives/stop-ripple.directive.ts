import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[isagStopRipple]'
})
export class StopRippleDirective {

  @HostListener('mousedown', ['$event'])
  onClick(e) {
    e.stopPropagation();
  }
}
