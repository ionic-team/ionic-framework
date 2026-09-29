import { Directive, HostListener, ElementRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

@Directive({
  standalone: false,
  selector: 'ion-input[type=number],ion-input-otp:not([type=text]),ion-range',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumericValueAccessorDirective,
      multi: true,
    },
  ],
})
export class NumericValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, private el: ElementRef<HTMLInputElement | HTMLIonRangeElement>) {
    super(injector, el);
  }

  // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
  // this directive's multi-element selector makes Angular 22's stricter host-binding
  // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
  // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
  @HostListener('ionInput', ['$event'])
  handleInputEvent(ev: Event): void {
    const el = ev.target as HTMLIonInputElement | HTMLIonInputOtpElement | HTMLIonRangeElement;
    this.handleValueChange(el, el.value);
  }

  registerOnChange(fn: (_: number | null) => void): void {
    if (this.el.nativeElement.tagName === 'ION-INPUT' || this.el.nativeElement.tagName === 'ION-INPUT-OTP') {
      super.registerOnChange((value: string) => {
        fn(value === '' ? null : parseFloat(value));
      });
    } else {
      super.registerOnChange(fn);
    }
  }
}
