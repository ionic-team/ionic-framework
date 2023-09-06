import { CommonModule, JsonPipe, KeyValuePipe } from "@angular/common";
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
    /**
     * NgFor directive is not available until Angular 15.
     * We import the CommonModule for now.
     */
    CommonModule
  ]
})
export class ValueAccessorTestComponent {

  @Input() formGroup!: FormGroup;

}
