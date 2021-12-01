import { Directive, Input, OnChanges, SimpleChanges, StaticProvider, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, Validators } from '@angular/forms';

import { toFloat } from './validator-utils';

export const ION_MIN_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IonMinValidator),
  multi: true
};

@Directive({
  selector: 'ion-input[type=number][min][formControlName],ion-input[type=number][min][formControl],ion-input[type=number][min][ngModel]',
  providers: [ION_MIN_VALIDATOR],
  host: {
    '[attr.min]': 'enabled() ? min : null'
  }
})
export class IonMinValidator implements Validator, OnChanges {
  // tslint:disable-next-line: no-unbound-method
  private _validator = Validators.nullValidator;
  private _onChange!: () => void;

  /**
   * Tracks changes to the min bound to this directive.
   */
  @Input() min!: string | number | null;

  ngOnChanges(changes: SimpleChanges): void {
    if ('min' in changes) {
      const input = toFloat(changes.min.currentValue);
      // tslint:disable-next-line: no-unbound-method
      this._validator = this.enabled() ? Validators.min(input) : Validators.nullValidator;
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
    return this.min !== null;
  }

}
