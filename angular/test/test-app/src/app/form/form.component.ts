import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

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
      range: [20, Validators.min(10)],
    }, {updateOn: 'blur'});
  }

  setValues() {
    this.profileForm.patchValue({
      datetime: '2010-08-20',
      setValue: 'nes',
      toggle: true,
      input: 'Some value',
      input2: 'Another values',
      checkbox: true,
      range: 50
    });
  }

}
