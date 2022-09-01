import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-textarea,ion-searchbar',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextValueAccessorDirective,
      multi: true,
    },
  ],
})
export class TextValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleInputEvent(el: any): void {
    this.commitValueChange(el, el.value);
  }
}

@Directive({
  selector: 'ion-input:not([type=number])',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputValueAccessorDirective,
      multi: true,
    },
  ],
})
export class InputValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionInput', ['$event.target'])
  _handleInputEvent(el: any): void {
    this.commitValueChange(el, el.value);
  }
}
