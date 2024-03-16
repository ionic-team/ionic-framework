import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonDatetime } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-datetime',
  templateUrl: 'datetime.component.html',
  standalone: true,
  imports: [
    IonDatetime,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class DatetimeComponent {

  form = this.fb.group({
    datetime: ['2023-05-10T04:00:00', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
