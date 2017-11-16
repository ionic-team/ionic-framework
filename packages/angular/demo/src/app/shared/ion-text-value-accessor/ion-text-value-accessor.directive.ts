import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// NOTE: this is just a sample. It really belongs in @ionic/angular and not at all int his app here
// May also need to look at this to see if we need anything else:
// https://github.com/angular/angular/blob/5.0.1/packages/forms/src/directives/default_value_accessor.ts#L33-L101
@Directive({
  selector: 'ion-input',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IonTextValueAccessorDirective, multi: true }]
})
export class IonTextValueAccessorDirective implements ControlValueAccessor {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
  }

  @HostListener('input', ['$event.target.value'])
  _handleInputEvent(value: any) {
    this.onChange(value);
  }

  @HostListener('ionBlur')
  _handleBlurEvent() {
    this.onTouched();
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
