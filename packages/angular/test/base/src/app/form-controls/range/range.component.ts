import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html'
})
export class RangeComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      range: [5, Validators.min(10)]
    });
  }

}
