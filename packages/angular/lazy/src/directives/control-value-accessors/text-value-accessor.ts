import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

@Directive({
  standalone: false,
  selector: 'ion-input:not([type=number]),ion-input-otp[type=text],ion-textarea,ion-searchbar',
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

  // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
  // this directive's multi-element selector makes Angular 22's stricter host-binding
  // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
  // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
  @HostListener('ionInput', ['$event'])
  _handleInputEvent(ev: Event): void {
    const el = ev.target as
      | HTMLIonInputElement
      | HTMLIonInputOtpElement
      | HTMLIonTextareaElement
      | HTMLIonSearchbarElement;
    this.handleValueChange(el, el.value);
  }
}
