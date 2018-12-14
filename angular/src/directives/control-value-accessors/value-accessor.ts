import { ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class ValueAccessor implements ControlValueAccessor {

  private onChange: (value: any) => void = () => {/**/};
  private onTouched: () => void = () => {/**/};
  protected lastValue: any;

  constructor(protected el: ElementRef) {}

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

export function setIonicClasses(element: ElementRef) {
  requestAnimationFrame(() => {
    const classList = (element.nativeElement as HTMLElement).classList;

    classList.remove(
      'ion-valid',
      'ion-invalid',
      'ion-touched',
      'ion-untouched',
      'ion-dirty',
      'ion-pristine'
    );

    for (let i = 0; i < classList.length; i++) {
      const item = classList.item(i);
      if (item !== null && startsWith(item, 'ng-')) {
        classList.add(`ion-${item.substr(3)}`);
      }
    }
  });
}

function startsWith(input: string, search: string): boolean {
  return input.substr(0, search.length) === search;
}
