import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonTextarea } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-textarea',
  templateUrl: 'textarea.component.html',
  standalone: true,
  imports: [
    IonTextarea,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class TextareaComponent {

  form = this.fb.group({
    textarea: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
