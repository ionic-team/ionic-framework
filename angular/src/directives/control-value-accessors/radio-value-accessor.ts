import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioValueAccessor,
      multi: true
    }
  ]
})
export class RadioValueAccessor extends ValueAccessor {

  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionSelect', ['$event.target.checked'])
  _handleIonSelect(value: any) {
    this.handleChangeEvent(value);
  }
}
