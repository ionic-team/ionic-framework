import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Directive({
  selector: '[requireTrue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RequireTrueValidatorDirective),
      multi: true,
    },
  ],
})
export class RequireTrueValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.requiredTrue(control);
  }
}