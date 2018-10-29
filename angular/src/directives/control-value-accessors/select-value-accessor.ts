import { Directive, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setIonicClasses } from './util/set-ionic-classes';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-range, ion-select, ion-radio-group, ion-segment, ion-datetime',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectValueAccessor,
      multi: true
    }
  ]
})
export class SelectValueAccessor implements ControlValueAccessor {

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
  private muteOnChange: boolean;

  writeValue(value: any) {
    this.muteOnChange = true;
    this.element.nativeElement.value = value;

    requestAnimationFrame(() => {
      setIonicClasses(this.element);
    });
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleChangeEvent(value: any) {
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

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.element.nativeElement.disabled = isDisabled;
  }
}
