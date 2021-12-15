import { Directive, HostListener, ElementRef, Injector } from '@angular/core';

import { ValueAccessor, setIonicClasses, valueAccessorProvider } from './value-accessor';

@Directive({
  selector: 'ion-checkbox,ion-toggle',
  providers: [valueAccessorProvider(BooleanValueAccessorDirective)],
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
