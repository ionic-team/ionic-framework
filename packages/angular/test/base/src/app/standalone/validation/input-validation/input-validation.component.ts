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
  IonInput,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class InputValidationComponent {
  // Field metadata for labels and error messages
  fieldMetadata = {
    email: {
      label: 'Email',
      helperText: "We'll never share your email",
      errorText: 'Please enter a valid email address'
    },
    name: {
      label: 'Full Name',
      helperText: 'First and last name',
      errorText: 'Name is required'
    },
    phone: {
      label: 'Phone',
      helperText: 'Format: (555) 555-5555',
      errorText: 'Please enter a valid phone number'
    },
    password: {
      label: 'Password',
      helperText: 'At least 8 characters',
      errorText: 'Password must be at least 8 characters'
    },
    age: {
      label: 'Age',
      helperText: 'Must be 18 or older',
      errorText: 'Please enter a valid age (18-120)'
    },
    optional: {
      label: 'Optional Info',
      helperText: 'You can skip this field',
      errorText: ''
    }
  };

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
    optional: ['']
  });

  constructor(private fb: FormBuilder) {}

  // Submit form
  onSubmit(): void {
    if (this.form.valid) {
      alert('Form submitted successfully!');
    }
  }
}
