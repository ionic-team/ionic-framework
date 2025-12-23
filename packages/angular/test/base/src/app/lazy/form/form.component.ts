import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors } from '@angular/forms';

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
    selector: 'app-form',
    templateUrl: './form.component.html',
    standalone: false
})
export class FormComponent {

  submitted = 'false';
  profileForm: UntypedFormGroup;
  outsideToggle = new UntypedFormControl(true);

  constructor(fb: UntypedFormBuilder) {
    this.profileForm = fb.group({
      datetime: ['2010-08-20', Validators.required],
      select: [undefined, Validators.required],
      toggle: [false],
      textarea: ['', Validators.required],
      textarea2: ['Default Value'],
      input: ['', Validators.required],
      input2: ['Default Value'],
      inputOtp: [null, [Validators.required, otpRequiredLength(4)]],
      inputOtpText: ['', [Validators.required, otpRequiredLength(4)]],
      inputOtp2: [1234],
      inputMin: [1, Validators.min(1)],
      inputMax: [1, Validators.max(1)],
      checkbox: [false],
      radio: [undefined]
    }, {
      updateOn: typeof (window as any) !== 'undefined' && window.location.hash === '#blur' ? 'blur' : 'change'
    });
  }

  setInputTouched() {
    const formControl = this.profileForm.get('input');
    if (formControl) {
      formControl.markAsTouched();
    }
  }

  setTextareaTouched() {
    const formControl = this.profileForm.get('textarea');
    if (formControl) {
      formControl.markAsTouched();
    }
  }

  setOtpTouched() {
    const formControl = this.profileForm.get('inputOtp');
    if (formControl) {
      formControl.markAsTouched();
    }
  }

  onSubmit() {
    this.submitted = 'true';
  }

  setValues() {
    this.profileForm.patchValue({
      datetime: '2010-08-20',
      select: 'nes',
      toggle: true,
      textarea: 'Some value',
      textarea2: 'Another values',
      input: 'Some value',
      input2: 'Another values',
      inputOtp: 5678,
      inputOtpText: 'ABCD',
      inputOtp2: 1234,
      checkbox: true,
      radio: 'nes'
    });
  }

  markAllAsTouched() {
    this.profileForm.markAllAsTouched();
  }

}
