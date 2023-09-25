import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  standalone: true,
  imports: [
    IonInput,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent,
  ]
})
export class InputComponent {

  form = this.fb.group({
    inputString: ['', Validators.required],
    inputNumber: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
