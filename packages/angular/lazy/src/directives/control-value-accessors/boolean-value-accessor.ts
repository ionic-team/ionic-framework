import { Directive, HostListener, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from '@ionic/angular/common';

@Directive({
  standalone: false,
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

  writeValue(value: boolean): void {
    this.elementRef.nativeElement.checked = this.lastValue = value;
    setIonicClasses(this.elementRef);
  }

  // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
  // this directive's multi-element selector makes Angular 22's stricter host-binding
  // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
  // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
  @HostListener('ionChange', ['$event'])
  _handleIonChange(ev: Event): void {
    const el = ev.target as HTMLIonCheckboxElement | HTMLIonToggleElement;
    this.handleValueChange(el, el.checked);
  }
}
