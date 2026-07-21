import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
  IonLabel, IonDatetime, IonNote, IonSelect, IonSelectOption, 
  IonToggle, IonInput, IonInputOtp, IonCheckbox, IonRadioGroup, 
  IonRadio, IonRange, IonTextarea, IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
    IonLabel, IonDatetime, IonNote, IonSelect, IonSelectOption, 
    IonToggle, IonInput, IonInputOtp, IonCheckbox, IonRadioGroup, 
    IonRadio, IonRange, IonTextarea, IonButton
  ],
})
export class InputsComponent {
  // Create the FormGroup
  form = new FormGroup({
    datetime: new FormControl('1994-03-15'),
    input: new FormControl('some text'),
    inputOtp: new FormControl('1234'),
    checkbox: new FormControl(true),
    radio: new FormControl('nes'),
    toggle: new FormControl(true),
    select: new FormControl('nes'),
    range: new FormControl(50),
    textarea: new FormControl('some text'),
  });

  // States
  isDisabled = false;
  isReadonly = false;

  setValues() {
    console.log('set values');
    this.form.patchValue({
      datetime: '1994-03-15',
      input: 'some text',
      inputOtp: '1234',
      checkbox: true,
      radio: 'nes',
      toggle: true,
      select: 'nes',
      range: 50,
      textarea: 'some text',
    });
  }

  resetValues() {
    console.log('reset values');
    // reset them each
    this.form.patchValue({
      datetime: undefined,
      input: undefined,
      inputOtp: undefined,
      checkbox: false,
      radio: undefined,
      toggle: false,
      select: undefined,
      range: undefined,
      textarea: undefined,
    });
  }

  toggleDisable() {
    console.log(`toggle disable to ${!this.isDisabled}`);
    this.isDisabled = !this.isDisabled;
  }

  toggleReadonly() {
    console.log(`toggle readonly to ${!this.isReadonly}`);
    this.isReadonly = !this.isReadonly;
  }
}
