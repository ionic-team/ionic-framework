import { ElementRef, Injector, Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';

@Directive({
  selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar',
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
  _handleInputEvent(el: HTMLIonInputElement | HTMLIonTextareaElement | HTMLIonSearchbarElement): void {
    this.handleValueChange(el, el.value);
  }
}
