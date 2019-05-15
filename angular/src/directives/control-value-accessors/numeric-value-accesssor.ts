import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-input[type=number]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumericValueAccessor,
      multi: true
    }
  ]
})
export class NumericValueAccessor extends ValueAccessor {

  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleIonChange(value: any) {
    this.handleChangeEvent(value);
  }

  registerOnChange(fn: (_: number | null) => void) {
    super.registerOnChange(value => {
      fn(value === '' ? null : parseFloat(value));
    });
  }
}
