import { AfterViewInit, ElementRef, Injector, OnDestroy, Directive, HostListener } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { raf } from '../../utils/util';

// TODO(FW-2827): types

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

  constructor(protected injector: Injector, protected elementRef: ElementRef) {}

  writeValue(value: any): void {
    this.elementRef.nativeElement.value = this.lastValue = value;
    setIonicClasses(this.elementRef);
  }

  /**
   * Notifies the ControlValueAccessor of a change in the value of the control.
   *
   * This is called by each of the ValueAccessor directives when we want to update
   * the status and validity of the form control. For example with text components this
   * is called when the ionInput event is fired. For select components this is called
   * when the ionChange event is fired.
   *
   * This also updates the Ionic form status classes on the element.
   *
   * @param el The component element.
   * @param value The new value of the control.
   */
  handleValueChange(el: HTMLElement, value: any): void {
    if (el === this.elementRef.nativeElement) {
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.onChange(value);
      }
      setIonicClasses(this.elementRef);
    }
  }

  @HostListener('ionBlur', ['$event.target'])
  _handleBlurEvent(el: any): void {
    if (el === this.elementRef.nativeElement) {
      this.onTouched();
      setIonicClasses(this.elementRef);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
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
      this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.elementRef));
    }

    /**
     * TODO FW-2787: Remove this in favor of https://github.com/angular/angular/issues/10887
     * whenever it is implemented.
     */
    const formControl = ngControl.control as any;
    if (formControl) {
      const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
      methodsToPatch.forEach((method) => {
        if (typeof formControl[method] !== 'undefined') {
          const oldFn = formControl[method].bind(formControl);
          formControl[method] = (...params: any[]) => {
            oldFn(...params);
            setIonicClasses(this.elementRef);
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
  const classes: string[] = [];
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
