import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// NOTE: this is just a sample. It really belongs in @ionic/angular and not at all int his app here
@Directive({
  selector: 'ion-input',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IonInputValueAccessorDirective, multi: true }]
})
export class IonInputValueAccessorDirective implements ControlValueAccessor {
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

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
}
