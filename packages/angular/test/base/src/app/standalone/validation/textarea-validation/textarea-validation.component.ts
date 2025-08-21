import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('debugRegion', { static: true }) debugRegion?: ElementRef<HTMLDivElement>;

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

  // Check if a field has been touched
  isTouched(fieldName: string): boolean {
    return this.touchedFields.has(fieldName);
  }

  // Check if a field is invalid
  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && this.isTouched(fieldName));
  }

  // Check if a field is valid
  isValid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.valid && this.isTouched(fieldName));
  }

  // Mark a field as touched
  markTouched(fieldName: string): void {
    this.touchedFields.add(fieldName);
  }

  // Handle blur event
  onIonBlur(fieldName: string, textareaElement: IonTextarea): void {
    this.markTouched(fieldName);
    this.updateValidationClasses(fieldName, textareaElement);

    // Update aria-live region if invalid
    if (this.isInvalid(fieldName) && this.debugRegion) {
      const metadata = this.fieldMetadata[fieldName as keyof typeof this.fieldMetadata];
      this.debugRegion.nativeElement.textContent =
        `Field ${metadata.label} is invalid: ${metadata.errorText}`;
      console.log('Field marked invalid:', metadata.label, metadata.errorText);
    }
  }

  // Handle input event
  onIonInput(fieldName: string, textareaElement: IonTextarea): void {
    if (this.isTouched(fieldName)) {
      this.updateValidationClasses(fieldName, textareaElement);
    }
  }

  // Handle focusout event (with timeout to match vanilla test)
  onFocusOut(fieldName: string, textareaElement: IonTextarea): void {
    setTimeout(() => {
      this.markTouched(fieldName);
      this.updateValidationClasses(fieldName, textareaElement);
    }, 10);
  }

  // Update validation classes on the textarea element
  private updateValidationClasses(fieldName: string, textareaElement: IonTextarea): void {
    // Access the native element through the Angular component
    const element = (textareaElement as any).el || (textareaElement as any).nativeElement;

    // Ensure we have a valid element with classList
    if (!element || !element.classList) {
      console.warn('Could not access native element for validation classes');
      return;
    }

    if (this.isTouched(fieldName)) {
      // Add ion-touched class
      element.classList.add('ion-touched');

      // Update ion-valid/ion-invalid classes
      if (this.isInvalid(fieldName)) {
        element.classList.remove('ion-valid');
        element.classList.add('ion-invalid');
      } else if (this.isValid(fieldName)) {
        element.classList.remove('ion-invalid');
        element.classList.add('ion-valid');
      }
    }
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

    // Clear aria-live region
    if (this.debugRegion) {
      this.debugRegion.nativeElement.textContent = '';
    }
  }
}
