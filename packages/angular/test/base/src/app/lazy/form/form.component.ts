import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
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
      input: ['', Validators.required],
      input2: ['Default Value'],
      inputMin: [1, Validators.min(1)],
      inputMax: [1, Validators.max(1)],
      checkbox: [false],
      radio: [undefined]
    }, {
      updateOn: typeof (window as any) !== 'undefined' && window.location.hash === '#blur' ? 'blur' : 'change'
    });
  }

  setTouched() {
    const formControl = this.profileForm.get('input');
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
      input: 'Some value',
      input2: 'Another values',
      checkbox: true,
      radio: 'nes'
    });
  }

  markAllAsTouched() {
    this.profileForm.markAllAsTouched();
  }

}
