import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonRadioGroup, IonRadio } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-radio-group',
  templateUrl: 'radio-group.component.html',
  standalone: true,
  imports: [
    IonRadioGroup,
    IonRadio,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class RadioGroupComponent {

  form = this.fb.group({
    radioGroup: ['1', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
