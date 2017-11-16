import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// NOTE: this is just a sample. It really belongs in @ionic/angular and not at all int his app here
@Directive({
  selector: 'ion-checkbox',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: IonCheckboxValueAccessorDirective, multi: true }]
})
export class IonCheckboxValueAccessorDirective implements ControlValueAccessor {
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.onChange = () => {};
    this.onTouched = () => {};
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  writeValue(value: any) {
    this.renderer.setProperty(this.element.nativeElement, 'checked', value);
  }

  @HostListener('ionChange', ['$event.target.checked'])
  _handleIonChange(value: any) {
    this.onChange(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled);
  }
}
