import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-checkbox,ion-toggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BooleanValueAccessor,
      multi: true
    }
  ]
})
export class BooleanValueAccessor extends ValueAccessor {

  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target.checked'])
  _handleIonChange(value: any) {
    this.handleChangeEvent(value);
  }
}
