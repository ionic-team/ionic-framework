import { AfterViewInit, ElementRef, HostListener, Injector, OnDestroy, Type } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { raf } from '../../util/util';

export class ValueAccessor implements ControlValueAccessor, AfterViewInit, OnDestroy {

  private onChange: (value: any) => void = () => {/**/};
  private onTouched: () => void = () => {/**/};
  protected lastValue: any;
  private statusChanges?: Subscription;

  constructor(protected injector: Injector, protected el: ElementRef) {}

  writeValue(value: any) {
    /**
     * TODO for Ionic 6:
     * Change `value == null ? '' : value;`
     * to `value`. This was a fix for IE9, but IE9
     * is no longer supported; however, this change
     * is potentially a breaking change
     */
    this.el.nativeElement.value = this.lastValue = value == null ? '' : value;
    setIonicClasses(this.el);
  }

  handleChangeEvent(el: HTMLElement, value: any) {
    if (el === this.el.nativeElement) {
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.onChange(value);
      }
      setIonicClasses(this.el);
    }
  }

  @HostListener('ionBlur', ['$event.target'])
  _handleBlurEvent(el: any) {
    if (el === this.el.nativeElement) {
      this.onTouched();
      setIonicClasses(this.el);
    }
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

  ngOnDestroy() {
    if (this.statusChanges) {
      this.statusChanges.unsubscribe();
    }
  }

  ngAfterViewInit() {
    let ngControl;
    try {
      ngControl = this.injector.get<NgControl>(NgControl as Type<NgControl>);
    } catch { /* No FormControl or ngModel binding */ }

    if (!ngControl) { return; }

    // Listen for changes in validity, disabled, or pending states
    if (ngControl.statusChanges) {
      this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.el));
    }

    /**
     * TODO Remove this in favor of https://github.com/angular/angular/issues/10887
     * whenever it is implemented. Currently, Ionic's form status classes
     * do not react to changes when developers manually call
     * Angular form control methods such as markAsTouched.
     * This results in Ionic's form status classes being out
     * of sync with the ng form status classes.
     * This patches the methods to manually sync
     * the classes until this feature is implemented in Angular.
     */
    const formControl = ngControl.control;
    if (formControl) {
      const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
      methodsToPatch.forEach(method => {
       if (formControl[method]) {
         const oldFn = formControl[method].bind(formControl);
         formControl[method] = (...params) => {
           oldFn(...params);
           setIonicClasses(this.el);
          };
        }
      });
    }
  }
}

export const setIonicClasses = (element: ElementRef) => {
  raf(() => {
    const input = element.nativeElement as HTMLElement;
    const classes = getClasses(input);
    setClasses(input, classes);

    const item = input.closest('ion-item');
    if (item) {
      setClasses(item, classes);
    }
  });
};

const getClasses = (element: HTMLElement) => {
  const classList = element.classList;
  const classes = [];
  for (let i = 0; i < classList.length; i++) {
    const item = classList.item(i);
    if (item !== null && startsWith(item, 'ng-')) {
      classes.push(`ion-${item.substr(3)}`);
    }
  }
  return classes;
};

const setClasses = (element: HTMLElement, classes: string[]) => {
  const classList = element.classList;
  [
    'ion-valid',
    'ion-invalid',
    'ion-touched',
    'ion-untouched',
    'ion-dirty',
    'ion-pristine'
  ].forEach(c => classList.remove(c));

  classes.forEach(c => classList.add(c));
};

const startsWith = (input: string, search: string): boolean => {
  return input.substr(0, search.length) === search;
};
