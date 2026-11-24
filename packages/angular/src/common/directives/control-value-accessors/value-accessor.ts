import {
  AfterViewInit,
  DoCheck,
  ElementRef,
  EffectRef,
  Injector,
  OnDestroy,
  Directive,
  HostListener,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { raf } from '../../utils/util';

// TODO(FW-2827): types

@Directive()
export class ValueAccessor implements ControlValueAccessor, AfterViewInit, DoCheck, OnDestroy {
  private onChange: (value: any) => void = () => {
    /**/
  };
  private onTouched: () => void = () => {
    /**/
  };
  protected lastValue: any;
  /**
   * The signal forms control bound to this element, if any. Pass it to
   * `setIonicClasses` so the classes come from its state.
   */
  protected signalControl?: NgControl;
  private statusChanges?: Subscription;
  private signalControlEffect?: EffectRef;
  /** The reactive or template-driven control bound to this element, if any. */
  private reactiveControl?: NgControl;
  private lastReactiveState?: string;

  constructor(protected injector: Injector, protected elementRef: ElementRef) {}

  writeValue(value: any): void {
    this.elementRef.nativeElement.value = this.lastValue = value;
    setIonicClasses(this.elementRef, this.signalControl);
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
      setIonicClasses(this.elementRef, this.signalControl);
    }
  }

  @HostListener('ionBlur', ['$event.target'])
  _handleBlurEvent(el: any): void {
    if (el === this.elementRef.nativeElement) {
      this.onTouched();
      setIonicClasses(this.elementRef, this.signalControl);

      // When ion-radio is blurred, el and this.elementRef.nativeElement are
      // different so we need to check if the closest ion-radio-group is the same
      // as this.elementRef.nativeElement and if so, we need to mark the radio group
      // as touched
    } else if (el.closest('ion-radio-group') === this.elementRef.nativeElement) {
      this.onTouched();
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

  /**
   * Angular re-runs validation with `emitEvent: false` in places such as
   * directive setup, so an async validator can settle without emitting
   * `statusChanges`. Checking the control state on every change detection
   * run catches those updates, the same way Angular updates its `ng-*`
   * classes.
   */
  ngDoCheck(): void {
    if (!this.reactiveControl) {
      return;
    }
    const state = getStateClasses(this.reactiveControl).join(' ');
    if (state !== this.lastReactiveState) {
      this.lastReactiveState = state;
      setIonicClasses(this.elementRef, this.reactiveControl);
    }
  }

  ngOnDestroy(): void {
    if (this.statusChanges) {
      this.statusChanges.unsubscribe();
    }
    this.signalControlEffect?.destroy();
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

    /**
     * Signal forms (`[formField]`) provide an NgControl without
     * `statusChanges` or `markAs*` methods, so there is nothing to
     * subscribe to or patch. Its state getters read signals instead,
     * so an effect re-runs whenever that state changes.
     */
    if (!ngControl.statusChanges) {
      const control = (this.signalControl = ngControl);
      this.signalControlEffect = effect(() => setIonicClasses(this.elementRef, control), { injector: this.injector });
      return;
    }

    this.reactiveControl = ngControl;
    this.lastReactiveState = getStateClasses(ngControl).join(' ');

    // Listen for changes in validity, disabled, or pending states
    this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.elementRef));

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

/**
 * Sets the Ionic form status classes (`ion-touched`, `ion-invalid`, etc.)
 * on the element and its parent item.
 *
 * @param element The component element.
 * @param control The bound form control. When passed, the classes are built
 * from its state instead of copied from the `ng-*` classes on the element.
 */
export const setIonicClasses = (element: ElementRef, control?: NgControl): void => {
  /**
   * Read the control state before the raf so an effect calling this
   * tracks the signals behind these getters.
   */
  const stateClasses = control ? getStateClasses(control) : undefined;
  raf(() => {
    const input = element.nativeElement as HTMLInputElement;
    const hasValue = input.value != null && input.value.toString().length > 0;
    const classes = stateClasses ?? getClasses(input);
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

const getStateClasses = (control: NgControl): string[] => {
  const classes = [control.touched ? 'ion-touched' : 'ion-untouched', control.dirty ? 'ion-dirty' : 'ion-pristine'];
  // A pending control is neither valid nor invalid.
  if (control.valid) {
    classes.push('ion-valid');
  } else if (control.invalid) {
    classes.push('ion-invalid');
  } else if (control.pending) {
    classes.push('ion-pending');
  }
  return classes;
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
  classList.remove(
    'ion-valid',
    'ion-invalid',
    'ion-pending',
    'ion-touched',
    'ion-untouched',
    'ion-dirty',
    'ion-pristine'
  );
  classList.add(...classes);
};

const startsWith = (input: string, search: string): boolean => {
  return input.substring(0, search.length) === search;
};
