import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonCheckbox,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-checkbox-validation',
  templateUrl: './checkbox-validation.component.html',
  styleUrls: ['./checkbox-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonCheckbox,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class CheckboxValidationComponent {
  // Field metadata for labels and error messages
  fieldMetadata = {
    terms: {
      label: 'I agree to the terms and conditions',
      helperText: "You must agree to continue",
      errorText: 'This field is required'
    },
    optional: {
      label: 'Optional Checkbox',
      helperText: 'You can skip this field',
      errorText: ''
    }
  };

  form = this.fb.group({
    terms: [false, Validators.requiredTrue],
    optional: [false]
  });

  constructor(private fb: FormBuilder) {}

  // Submit form
  onSubmit(): void {
    if (this.form.valid) {
      alert('Form submitted successfully!');
    }
  }
}
