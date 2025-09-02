import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

// Custom validator for address (must be at least 10 chars and contain a digit)
function addressValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || value.length < 10) {
    return { invalidAddress: true };
  }
  // Check if it contains at least one number (for street/zip)
  return /\d/.test(value) ? null : { invalidAddress: true };
}

@Component({
  selector: 'app-textarea-validation',
  templateUrl: './textarea-validation.component.html',
  styleUrls: ['./textarea-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonTextarea,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class TextareaValidationComponent {
  // Track which fields have been touched (using Set like vanilla test)
  touchedFields = new Set<string>();

  // Field metadata for labels and error messages
  fieldMetadata = {
    description: {
      label: 'Description',
      helperText: 'At least 20 characters',
      errorText: 'Description must be at least 20 characters',
      rows: 4
    },
    comments: {
      label: 'Comments',
      helperText: 'Please provide your feedback',
      errorText: 'Comments are required',
      rows: 4
    },
    bio: {
      label: 'Bio',
      helperText: 'Maximum 200 characters',
      errorText: 'Bio is required',
      rows: 4,
      counter: true
    },
    address: {
      label: 'Address',
      helperText: 'Include street, city, state, and zip',
      errorText: 'Please enter a complete address',
      rows: 3
    },
    review: {
      label: 'Product Review',
      helperText: 'Between 50-500 characters',
      errorText: 'Review must be between 50-500 characters',
      rows: 5,
      counter: true
    },
    notes: {
      label: 'Additional Notes',
      helperText: 'This field is optional',
      errorText: '',
      rows: 3
    }
  };

  form = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(20)]],
    comments: ['', Validators.required],
    bio: ['', [Validators.required, Validators.maxLength(200)]],
    address: ['', [Validators.required, addressValidator]],
    review: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
    notes: ['']
  });

  constructor(private fb: FormBuilder) {}

  // Check if a field is invalid
  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  // Check if a field is valid
  isValid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  // Check if form is valid (excluding optional field)
  isFormValid(): boolean {
    const requiredFields = ['description', 'comments', 'bio', 'address', 'review'];
    return requiredFields.every(field => {
      const control = this.form.get(field);
      return control && control.valid;
    });
  }

  // Submit form
  onSubmit(): void {
    if (this.isFormValid()) {
      alert('Form submitted successfully!');
    }
  }

  // Reset form
  onReset(): void {
    // Reset form values
    this.form.reset();

    // Clear touched fields
    this.touchedFields.clear();

    // Remove validation classes from all textareas
    const textareas = document.querySelectorAll('ion-textarea');
    textareas.forEach(textarea => {
      textarea.classList.remove('ion-valid', 'ion-invalid', 'ion-touched');
    });
  }
}
