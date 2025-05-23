import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { IonInputOtp } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

function otpRequiredLength(length: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.toString().length !== length) {
      return { otpLength: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-input-otp',
  templateUrl: 'input-otp.component.html',
  standalone: true,
  imports: [
    IonInputOtp,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class InputOtpComponent {
  form = this.fb.group({
    inputOtpString: ['', [Validators.required, otpRequiredLength(4)]],
    inputOtpNumber: ['', [Validators.required, otpRequiredLength(4)]],
  });

  constructor(private fb: FormBuilder) { }
}
