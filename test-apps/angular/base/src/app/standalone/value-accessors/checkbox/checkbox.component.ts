import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonCheckbox } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  standalone: true,
  imports: [
    IonCheckbox,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class CheckboxComponent {

  form = this.fb.group({
    checkbox: [false, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
