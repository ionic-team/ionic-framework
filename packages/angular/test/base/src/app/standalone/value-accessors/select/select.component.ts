import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-select',
  templateUrl: 'select.component.html',
  standalone: true,
  imports: [
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class SelectComponent {

  form = this.fb.group({
    select: ['bananas', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
