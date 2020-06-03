import { Directive, ElementRef, HostListener, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor, setIonicClasses } from './value-accessor';

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

  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  writeValue(value: any) {
    this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
    setIonicClasses(this.el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleIonChange(el: any) {
    this.handleChangeEvent(el, el.checked);
  }
}
