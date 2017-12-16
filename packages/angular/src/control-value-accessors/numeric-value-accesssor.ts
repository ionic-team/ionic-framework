import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any): void {
    // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
    // Probably not an issue for us, but it doesn't really cost anything either
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(
      this.element.nativeElement,
      'value',
      normalizedValue
    );
  }

  @HostListener('input', ['$event.target.value'])
  _handleInputEvent(value: any): void {
    this.onChange(value);
  }

  @HostListener('ionBlur')
  _handleBlurEvent(): void {
    this.onTouched();
  }

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = value => {
      fn(value == '' ? null : parseFloat(value));
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
