import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { setIonicClasses } from './util/set-ionic-classes';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-radio',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioValueAccessor,
      multi: true
    }
  ]
})
export class RadioValueAccessor implements ControlValueAccessor {
  @Input() value: any;

  onChange: (value: any) => void;
  onTouched: () => void;

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {/**/};
    this.onTouched = () => {/**/};
  }

  writeValue(value: any) {
    this.renderer.setProperty(
      this.element.nativeElement,
      'checked',
      value === this.value
    );
    setIonicClasses(this.element);
  }

  @HostListener('ionSelect', ['$event.target.checked'])
  _handleIonSelect(value: any) {
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
    this.onChange = () => {
      fn(this.value);
    };
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
