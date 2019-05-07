import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

  submitted = 'false';
  profileForm: FormGroup;
  outsideToggle = new FormControl(true);

  constructor(fb: FormBuilder) {
    this.profileForm = fb.group({
      datetime: ['2010-08-20', Validators.required],
      select: [undefined, Validators.required],
      toggle: [false],
      input: ['', Validators.required],
      input2: ['Default Value'],
      checkbox: [false],
      range: [5, Validators.min(10)],
    }, {updateOn: window.location.hash === '#blur' ? 'blur' : 'change'});
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

}
