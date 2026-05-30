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
  IonToggle,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-toggle-validation',
  templateUrl: './toggle-validation.component.html',
  styleUrls: ['./toggle-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonToggle,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class ToggleValidationComponent {
  // Field metadata for labels and error messages
  fieldMetadata = {
    on: {
      label: 'Tap to turn on',
      helperText: "You must turn on to continue",
      errorText: 'This field is required'
    },
    optional: {
      label: 'Optional Toggle',
      helperText: 'You can skip this field',
      errorText: ''
    }
  };

  form = this.fb.group({
    on: [false, Validators.requiredTrue],
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
