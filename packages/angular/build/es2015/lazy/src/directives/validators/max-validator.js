import { __decorate } from "tslib";
import { Directive, forwardRef } from '@angular/core';
import { MaxValidator, NG_VALIDATORS } from '@angular/forms';
/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const ION_MAX_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IonMaxValidator),
    multi: true,
};
let IonMaxValidator = class IonMaxValidator extends MaxValidator {
};
IonMaxValidator = __decorate([
    Directive({
        standalone: false,
        selector: 'ion-input[type=number][max][formControlName],ion-input[type=number][max][formControl],ion-input[type=number][max][ngModel]',
        providers: [ION_MAX_VALIDATOR],
        host: { '[attr.max]': 'enabled(max) ? max : null' },
    })
], IonMaxValidator);
export { IonMaxValidator };
