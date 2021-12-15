import { ElementRef, Injector, Directive, HostListener } from '@angular/core';

import { ValueAccessor, valueAccessorProvider } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar',
  providers: [valueAccessorProvider(TextValueAccessorDirective)],
})
export class TextValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleInputEvent(el: any): void {
    this.handleChangeEvent(el, el.value);
  }
}
