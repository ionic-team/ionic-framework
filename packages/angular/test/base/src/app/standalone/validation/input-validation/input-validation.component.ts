import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  IonInput,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonApp,
  IonButtons,
  IonItem,
  IonList
} from '@ionic/angular/standalone';

// Custom validator for phone pattern
function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
  return phonePattern.test(value) ? null : { invalidPhone: true };
}

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonApp,
    IonInput,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonItem,
    IonList
  ]
})
export class InputValidationComponent {
  @ViewChild('debugRegion', { static: true }) debugRegion?: ElementRef<HTMLDivElement>;

  // Track which fields have been touched (using Set like vanilla test)
  touchedFields = new Set<string>();

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
  onIonBlur(fieldName: string, inputElement: IonInput): void {
    this.markTouched(fieldName);
    this.updateValidationClasses(fieldName, inputElement);
    
    // Update aria-live region if invalid
    if (this.isInvalid(fieldName) && this.debugRegion) {
      const metadata = this.fieldMetadata[fieldName as keyof typeof this.fieldMetadata];
      this.debugRegion.nativeElement.textContent = 
        `Field ${metadata.label} is invalid: ${metadata.errorText}`;
      console.log('Field marked invalid:', metadata.label, metadata.errorText);
    }
  }

  // Handle input event
  onIonInput(fieldName: string, inputElement: IonInput): void {
    if (this.isTouched(fieldName)) {
      this.updateValidationClasses(fieldName, inputElement);
    }
  }

  // Handle focusout event (with timeout to match vanilla test)
  onFocusOut(fieldName: string, inputElement: IonInput): void {
    setTimeout(() => {
      this.markTouched(fieldName);
      this.updateValidationClasses(fieldName, inputElement);
    }, 10);
  }

  // Update validation classes on the input element
  private updateValidationClasses(fieldName: string, inputElement: IonInput): void {
    const element = inputElement as any;
    
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
    const requiredFields = ['email', 'name', 'phone', 'password', 'age'];
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
    
    // Remove validation classes from all inputs
    const inputs = document.querySelectorAll('ion-input');
    inputs.forEach(input => {
      input.classList.remove('ion-valid', 'ion-invalid', 'ion-touched');
    });
    
    // Clear aria-live region
    if (this.debugRegion) {
      this.debugRegion.nativeElement.textContent = '';
    }
  }
}
