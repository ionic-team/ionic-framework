import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setIonicClasses } from './util/set-ionic-classes';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-checkbox,ion-toggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BooleanValueAccessor,
      multi: true
    }
  ]
})
export class BooleanValueAccessor implements ControlValueAccessor {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {/**/};
    this.onTouched = () => {/**/};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'checked', value);
    setIonicClasses(this.element);
  }

  @HostListener('ionChange', ['$event.target.checked'])
  _handleIonChange(value: any) {
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

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
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
