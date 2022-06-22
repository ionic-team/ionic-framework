import { AfterViewInit, ElementRef, Injector, OnDestroy, Directive, HostListener } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { raf } from '../../util/util';

@Directive()
export class ValueAccessor implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private onChange: (value: any) => void = () => {
    /**/
  };
  private onTouched: () => void = () => {
    /**/
  };
  protected lastValue: any;
  private statusChanges?: Subscription;

  constructor(protected injector: Injector, protected el: ElementRef) {}

  writeValue(value: any): void {
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

  handleChangeEvent(el: HTMLElement, value: any): void {
    if (el === this.el.nativeElement) {
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.onChange(value);
      }
      setIonicClasses(this.el);
    }
  }

  @HostListener('ionBlur', ['$event.target'])
  _handleBlurEvent(el: any): void {
    if (el === this.el.nativeElement) {
      this.onTouched();
      setIonicClasses(this.el);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    if (this.statusChanges) {
      this.statusChanges.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    let ngControl;
    try {
      ngControl = this.injector.get<NgControl>(NgControl);
    } catch {
      /* No FormControl or ngModel binding */
    }

    if (!ngControl) {
      return;
    }

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
    const formControl = ngControl.control as any;
    if (formControl) {
      const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
      methodsToPatch.forEach((method) => {
        if (typeof formControl[method] !== 'undefined') {
          const oldFn = formControl[method].bind(formControl);
          formControl[method] = (...params: any[]) => {
            oldFn(...params);
            setIonicClasses(this.el);
          };
        }
      });
    }
  }
}

export const setIonicClasses = (element: ElementRef): void => {
  raf(() => {
    const input = element.nativeElement as HTMLInputElement;
    const hasValue = input.value != null && input.value.toString().length > 0;
    const classes = getClasses(input);
    setClasses(input, classes);
    const item = input.closest('ion-item');
    if (item) {
      if (hasValue) {
        setClasses(item, [...classes, 'item-has-value']);
      } else {
        setClasses(item, classes);
      }
    }
  });
};

const getClasses = (element: HTMLElement) => {
  const classList = element.classList;
  const classes = [];
  for (let i = 0; i < classList.length; i++) {
    const item = classList.item(i);
    if (item !== null && startsWith(item, 'ng-')) {
      classes.push(`ion-${item.substring(3)}`);
    }
  }
  return classes;
};

const setClasses = (element: HTMLElement, classes: string[]) => {
  const classList = element.classList;
  classList.remove('ion-valid', 'ion-invalid', 'ion-touched', 'ion-untouched', 'ion-dirty', 'ion-pristine');
  classList.add(...classes);
};

const startsWith = (input: string, search: string): boolean => {
  return input.substring(0, search.length) === search;
};
