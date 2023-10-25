import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { RangeChangeEventDetail } from '@ionic/core';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-range',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RangeValueAccessorDirective,
      multi: true,
    },
  ],
})
export class RangeValueAccessorDirective extends ValueAccessor {
  constructor(injector: Injector, el: ElementRef) {
    super(injector, el);
  }

  @HostListener('ionInput', ['$event'])
  _handleChangeEvent(
    ev: CustomEvent<RangeChangeEventDetail>
  ): void {
    this.handleValueChange(ev.target as HTMLIonRangeElement, ev.detail.value);
  }
}