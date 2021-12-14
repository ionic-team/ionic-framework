import { Directive, Input, OnChanges, SimpleChanges, StaticProvider, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';

import { toFloat } from './validator-utils';

export const ION_MAX_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IonMaxValidator),
  multi: true,
};

@Directive({
  selector:
    'ion-input[type=number][max][formControlName],ion-input[type=number][max][formControl],ion-input[type=number][max][ngModel]',
  providers: [ION_MAX_VALIDATOR],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[attr.max]': 'enabled() ? max : null',
  },
})
export class IonMaxValidator implements Validator, OnChanges {
  // tslint:disable-next-line: no-unbound-method
  private _validator = Validators.nullValidator;
  private _onChange!: () => void;

  /**
   * Tracks changes to the max bound to this directive.
   */
  @Input() max!: string | number | null;

  ngOnChanges(changes: SimpleChanges): void {
    if ('max' in changes) {
      const input = toFloat(changes.max.currentValue);
      // tslint:disable-next-line: no-unbound-method
      this._validator = this.enabled() ? Validators.max(input) : Validators.nullValidator;
      this._onChange();
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this._validator(control);
  }

  enabled(): boolean {
    return this.max !== null;
  }
}
