import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonToggle } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-toggle',
  templateUrl: 'toggle.component.html',
  standalone: true,
  imports: [
    IonToggle,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class ToggleComponent {

  form = this.fb.group({
    toggle: [false, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
