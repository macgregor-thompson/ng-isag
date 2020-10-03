import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[isagValidateMinMax]'
})
export class ValidateMinMaxDirective implements OnChanges {
  @Input() ngModel?: number;
  @Input() min?: number;
  @Input() max?: number;

  val: number;

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.min && this.ngModel < this.min) || (this.max && this.ngModel > this.max)) {
      this.el.nativeElement.classList.add('red');
    } else {
      this.el.nativeElement.classList.remove('red');
    }
  }

}
