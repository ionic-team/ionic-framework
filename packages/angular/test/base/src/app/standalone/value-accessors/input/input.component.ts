import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonInput } from "@ionic/angular";
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

  settleAsync?: () => void;

  // Stays pending until the settle button is clicked.
  asyncControl = new FormControl('', {
    asyncValidators: () => new Promise((resolve) => (this.settleAsync = () => resolve(null))),
  });

  constructor(private fb: FormBuilder) { }

}
