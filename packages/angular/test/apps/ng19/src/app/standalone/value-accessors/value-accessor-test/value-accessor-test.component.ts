import { NgFor, JsonPipe, KeyValuePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-value-accessor-test',
    templateUrl: 'value-accessor-test.component.html',
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
