import { Directive, HostListener, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor, setIonicClasses } from './value-accessor';

@Directive({
  selector: 'ion-checkbox,ion-toggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BooleanValueAccessorDirective,
      multi: true,
    },
  ],
})
export class BooleanValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  writeValue(value: any): void {
    this.el.nativeElement.checked = this.lastValue = value == null ? false : value;
    setIonicClasses(this.el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleIonChange(el: any): void {
    this.handleChangeEvent(el, el.checked);
  }
}
