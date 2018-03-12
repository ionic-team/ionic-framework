import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setIonicClasses } from './util/set-ionic-classes';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-input:not([type=number]),ion-textarea,ion-searchbar',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextValueAccessor,
      multi: true
    }
  ]
})
export class TextValueAccessor implements ControlValueAccessor {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {/**/};
    this.onTouched = () => {/**/};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
    setIonicClasses(this.element);
  }

  @HostListener('input', ['$event.target.value'])
  _handleInputEvent(value: any) {
    this.onChange(value);
    setTimeout(() => {
      setIonicClasses(this.element);
    });
  }

  @HostListener('ionBlur')
  _handleBlurEvent() {
    this.onTouched();
    setTimeout(() => {
      setIonicClasses(this.element);
    });
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.element.nativeElement,
      'disabled',
      isDisabled
    );
  }
}
