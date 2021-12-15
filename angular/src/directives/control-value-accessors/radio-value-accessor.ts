import { ElementRef, Injector, Directive, HostListener } from '@angular/core';

import { ValueAccessor, valueAccessorProvider } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-radio',
  providers: [valueAccessorProvider(RadioValueAccessorDirective)],
})
export class RadioValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionSelect', ['$event.target'])
  _handleIonSelect(el: any): void {
    this.handleChangeEvent(el, el.checked);
  }
}
