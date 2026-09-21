import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

@Directive({
  standalone: false,
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-select, ion-radio-group, ion-segment, ion-datetime',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectValueAccessorDirective,
      multi: true,
    },
  ],
})
export class SelectValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
  // this directive's multi-element selector makes Angular 22's stricter host-binding
  // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
  // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
  @HostListener('ionChange', ['$event'])
  _handleChangeEvent(ev: Event): void {
    const el = ev.target as
      | HTMLIonSelectElement
      | HTMLIonRadioGroupElement
      | HTMLIonSegmentElement
      | HTMLIonDatetimeElement;
    this.handleValueChange(el, el.value);
  }
}
