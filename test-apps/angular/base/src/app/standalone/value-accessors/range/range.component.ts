import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonRange } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-range',
  templateUrl: 'range.component.html',
  standalone: true,
  imports: [
    IonRange,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class RangeComponent {

  form = this.fb.group({
    range: [0, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
