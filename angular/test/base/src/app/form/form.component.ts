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
      checkbox: [false],
      range: [5, Validators.min(10)],
    }, {
      updateOn: typeof (window as any) !== 'undefined' && window.location.hash === '#blur' ? 'blur' : 'change'
    });
  }

  setTouched() {
    const formControl = this.profileForm.get('input');
    formControl.markAsTouched();
  }

  onSubmit(_ev) {
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
      range: 50
    });
  }

  markAllAsTouched() {
    this.profileForm.markAllAsTouched();
  }

}
