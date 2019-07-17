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
  const input = element.nativeElement as HTMLElement;
  const classes = getClasses(input);
  setClasses(input, classes);

  const item = input.closest('ion-item');
  if (item) {
    setClasses(item, classes);
  }
}

function getClasses(element: HTMLElement) {
  const classList = element.classList;
  const classes = [];
  for (let i = 0; i < classList.length; i++) {
    const item = classList.item(i);
    if (item !== null && startsWith(item, 'ng-')) {
      classes.push(`ion-${item.substr(3)}`);
    }
  }
  return classes;
}

function setClasses(element: HTMLElement, classes: string[]) {
  const classList = element.classList;

  classList.remove(
    'ion-valid',
    'ion-invalid',
    'ion-touched',
    'ion-untouched',
    'ion-dirty',
    'ion-pristine'
  );
  classList.add(...classes);
}

function startsWith(input: string, search: string): boolean {
  return input.substr(0, search.length) === search;
}
