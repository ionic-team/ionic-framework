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
  IonRadioGroup,
  IonRadio,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-radio-group-validation',
  templateUrl: './radio-group-validation.component.html',
  styleUrls: ['./radio-group-validation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class RadioGroupValidationComponent {
  // Field metadata for labels and error messages
  fieldMetadata = {
    fruits: {
      helperText: "You must select one to continue",
      errorText: 'This field is required',
      firstRadio: "Grapes",
      secondRadio: "Strawberries"
    },
    optional: {
      label: 'Optional Radio',
      helperText: 'You can skip this field',
      errorText: '',
      firstRadio: "Option A",
      secondRadio: "Option B"
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
