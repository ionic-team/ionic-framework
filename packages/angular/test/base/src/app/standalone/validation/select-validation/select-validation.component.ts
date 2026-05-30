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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-select-validation',
  templateUrl: './select-validation.component.html',
  styleUrls: ['./select-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class SelectValidationComponent {
  // Field metadata for labels and error messages
  fieldMetadata = {
    fruits: {
      label: 'Fruits',
      helperText: "Select an option",
      errorText: 'This field is required'
    },
    optional: {
      label: 'Colors',
      helperText: 'You can skip this field',
      errorText: ''
    }
  };

  form = this.fb.group({
    fruits: ['', Validators.required],
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
