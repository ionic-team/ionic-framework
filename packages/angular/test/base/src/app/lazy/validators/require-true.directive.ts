import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '@angular/forms';
import type { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appRequireTrue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RequireTrueValidatorDirective),
      multi: true,
    },
  ],
  standalone: false,
})
export class RequireTrueValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return Validators.requiredTrue(control);
  }
}
