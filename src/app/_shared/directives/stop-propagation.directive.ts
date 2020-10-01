import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[isagStopPropagation]'
})
export class StopPropagationDirective {
  @Input() stopPropagation = true;

  @HostListener('click', ['$event'])
  onClick(e) {
    e.stopPropagation();
  }

}
