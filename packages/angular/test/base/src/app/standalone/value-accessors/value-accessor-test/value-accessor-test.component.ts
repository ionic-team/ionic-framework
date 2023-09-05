import { JsonPipe, KeyValuePipe, NgFor } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-value-accessor-test',
  templateUrl: 'value-accessor-test.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    KeyValuePipe,
    NgFor
  ]
})
export class ValueAccessorTestComponent {

  @Input() formGroup!: FormGroup;

}
