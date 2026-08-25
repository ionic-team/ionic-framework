import { Directive, forwardRef, Provider } from '@angular/core';
import { MaxValidator, NG_VALIDATORS } from '@angular/forms';

/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const ION_MAX_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => IonMaxValidator),
  multi: true,
};

@Directive({
  standalone: false,
  selector:
    'ion-input[type=number][max][formControlName],ion-input[type=number][max][formControl],ion-input[type=number][max][ngModel]',
  providers: [ION_MAX_VALIDATOR],
  host: { '[attr.max]': 'enabled(max) ? max : null' },
})
export class IonMaxValidator extends MaxValidator {}
