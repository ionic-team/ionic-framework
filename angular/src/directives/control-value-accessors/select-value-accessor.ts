import { ElementRef, Injector, Directive, HostListener } from '@angular/core';

import { ValueAccessor, valueAccessorProvider } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-range, ion-select, ion-radio-group, ion-segment, ion-datetime',
  providers: [valueAccessorProvider(SelectValueAccessorDirective)],
})
export class SelectValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleChangeEvent(el: any): void {
    this.handleChangeEvent(el, el.value);
  }
}
