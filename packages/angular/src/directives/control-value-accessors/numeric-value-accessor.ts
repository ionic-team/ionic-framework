import { Directive, HostListener, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

@Directive({
  selector: 'ion-input[type=number],ion-range',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumericValueAccessorDirective,
      multi: true,
    },
  ],
})
export class NumericValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, private el: ElementRef<HTMLInputElement | HTMLIonRangeElement>) {
    super(injector, el);
  }

  @HostListener('ionInput', ['$event.target'])
  handleInputEvent(el: HTMLIonInputElement | HTMLIonRangeElement): void {
    this.handleValueChange(el, el.value);
  }

  registerOnChange(fn: (_: number | null) => void): void {
    if (this.el.nativeElement.tagName === 'ION-INPUT') {
      super.registerOnChange((value: string) => {
        fn(value === '' ? null : parseFloat(value));
      });
    }
  }
}
