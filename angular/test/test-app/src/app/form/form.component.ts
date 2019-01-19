import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

  profileForm: FormGroup;
  outsideToggle = new FormControl(true, { updateOn: 'blur' });

  constructor(fb: FormBuilder) {
    this.profileForm = fb.group({
      datetime: ['2010-08-20', Validators.required],
      select: [undefined, Validators.required],
      toggle: [true],
      input: ['', Validators.required],
      input2: ['Default Value'],
      checkbox: [true],
      range: [30, Validators.min(10)],
    }, {updateOn: 'blur'});
  }

}
