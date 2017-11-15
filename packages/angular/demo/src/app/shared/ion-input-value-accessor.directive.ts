import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// NOTE: this is just a sample. It really belongs in @ionic/angular and not at all int his app here
@Directive({
  selector: 'ion-input',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IonInputValueAccessorDirective, multi: true }]
})
export class IonInputValueAccessorDirective implements ControlValueAccessor  {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {};
  }

  onChange: (value: string) => void;

  writeValue(value: string) {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
  }

  @HostListener('input', ['$event.target.value'])
  _handleIllyChange(value: string) {
    this.onChange(value);
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChange = value => {
      fn(value);
    };
  }

  registerOnTouched() {}
}
