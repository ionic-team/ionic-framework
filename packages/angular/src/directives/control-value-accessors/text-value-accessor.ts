import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

// TODO(FW-5495): rename class since range isn't a text component
@Directive({
  selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar,ion-range',
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

  @HostListener('ionInput', ['$event.target'])
  _handleInputEvent(
    el: HTMLIonInputElement | HTMLIonTextareaElement | HTMLIonSearchbarElement | HTMLIonRangeElement
  ): void {
    this.handleValueChange(el, el.value);
  }
}
