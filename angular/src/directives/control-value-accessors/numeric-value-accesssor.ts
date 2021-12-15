import { Directive, HostListener, ElementRef, Injector } from '@angular/core';

import { ValueAccessor, valueAccessorProvider } from './value-accessor';

@Directive({
  selector: 'ion-input[type=number]',
  providers: [valueAccessorProvider(NumericValueAccessorDirective)],
})
export class NumericValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleIonChange(el: any): void {
    this.handleChangeEvent(el, el.value);
  }

  registerOnChange(fn: (_: number | null) => void): void {
    super.registerOnChange((value) => {
      fn(value === '' ? null : parseFloat(value));
    });
  }
}
