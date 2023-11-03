import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-segment',
  templateUrl: 'segment.component.html',
  standalone: true,
  imports: [
    IonSegment,
    IonSegmentButton,
    IonLabel,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class SegmentComponent {

  form = this.fb.group({
    segment: ['Paid', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
