import { Directive, forwardRef, Provider } from '@angular/core';
import { MinValidator, NG_VALIDATORS } from '@angular/forms';

/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const ION_MIN_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IonMinValidator),
  multi: true,
};

@Directive({
  selector:
    'ion-input[type=number][min][formControlName],ion-input[type=number][min][formControl],ion-input[type=number][min][ngModel]',
  providers: [ION_MIN_VALIDATOR],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '[attr.min]': '_enabled ? min : null' },
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class IonMinValidator extends MinValidator {}
