import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// NOTE: this is just a sample. It really belongs in @ionic/angular and not at all int his app here
// May also need to look at this to see if we need anything else:
// https://github.com/angular/angular/blob/5.0.2/packages/forms/src/directives/select_control_value_accessor.ts#L28-L158
@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'ion-select',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IonSelectValueAccessorDirective, multi: true }]
})
export class IonSelectValueAccessorDirective implements ControlValueAccessor {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleChangeEvent(value: any) {
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
