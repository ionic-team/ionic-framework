import { AfterViewInit, Component, signal } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonCheckbox } from "@ionic/angular";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  standalone: true,
  imports: [
    IonCheckbox,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class CheckboxComponent implements AfterViewInit {
  // Signal so the label set in ngAfterViewInit renders under OnPush (Angular 22 default).
  dynamicLabel = signal('');

  ngAfterViewInit(): void {
    this.dynamicLabel.set('Dynamic Checkbox Label');
  }

  form = this.fb.group({
    checkbox: [false, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
