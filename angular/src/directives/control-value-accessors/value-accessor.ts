import { ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class ValueAccessor implements ControlValueAccessor {

  private onChange: (value: any) => void = () => {/**/};
  private onTouched: () => void = () => {/**/};
  private lastValue: any;

  constructor(private el: ElementRef) {}

  writeValue(value: any) {
    this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
    setIonicClasses(this.el);
  }

  handleChangeEvent(value: any) {
    if (value !== this.lastValue) {
      this.lastValue = value;
      this.onChange(value);
    }
    setIonicClasses(this.el);
  }

  @HostListener('ionBlur')
  _handleBlurEvent() {
    this.onTouched();
    setIonicClasses(this.el);
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.el.nativeElement.disabled = isDisabled;
  }
}

function setIonicClasses(element: ElementRef) {
  requestAnimationFrame(() => {
    const classList = (element.nativeElement as HTMLElement).classList;

    classList.remove(
      'ion-valid',
      'ion-touched',
      'ion-untouched',
      'ion-dirty',
      'ion-pristine'
    );

    classList.forEach((cls: string) => {
      if (cls.startsWith('ng-')) {
        classList.add(`ion-${cls.substr(3)}`);
      }
    });
  });
}
