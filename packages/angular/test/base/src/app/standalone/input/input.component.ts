import { JsonPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  standalone: true,
  imports: [
    IonInput,
    ReactiveFormsModule,
    FormsModule,
    JsonPipe
  ]
})
export class InputComponent {

  form = this.fb.group({
    inputString: ['', Validators.required],
    inputNumber: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    console.log(this.form.value);
  }

}
