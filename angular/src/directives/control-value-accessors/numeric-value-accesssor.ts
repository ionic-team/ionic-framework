import { Directive, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setIonicClasses } from './util/set-ionic-classes';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-input[type=number]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumericValueAccessor,
      multi: true
    }
  ]
})
export class NumericValueAccessor implements ControlValueAccessor {

  constructor(private element: ElementRef) {
    this.onChange = () => {/**/};
    this.onTouched = () => {/**/};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  /**
   * Whether onChange should be mutted (not be fired). Will be true only when writeValue was called, which
   * means that value changed inside angular form (e.g. calling setValue on a control).
   */
  private muteOnChange = false;

  writeValue(value: any) {
    this.muteOnChange = true;

    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    // Probably not an issue for us, but it doesn't really cost anything either
    this.element.nativeElement.value = value == null ? '' : value;
    setIonicClasses(this.element);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleInputEvent(value: any) {
    if (!this.muteOnChange) {
      this.onChange(value);
    }
    
    this.muteOnChange = false;

    requestAnimationFrame(() => {
      setIonicClasses(this.element);
    });
  }

  @HostListener('ionBlur')
  _handleBlurEvent() {
    this.onTouched();

    requestAnimationFrame(() => {
      setIonicClasses(this.element);
    });
  }

  registerOnChange(fn: (_: number | null) => void) {
    this.onChange = value => {
      fn(value === '' ? null : parseFloat(value));
    };
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.element.nativeElement.disabled = isDisabled;
  }
}
