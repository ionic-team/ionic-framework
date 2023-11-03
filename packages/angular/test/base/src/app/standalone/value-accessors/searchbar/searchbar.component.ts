import { Component } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonSearchbar } from "@ionic/angular/standalone";
import { ValueAccessorTestComponent } from "../value-accessor-test/value-accessor-test.component";

@Component({
  selector: 'app-searchbar',
  templateUrl: 'searchbar.component.html',
  standalone: true,
  imports: [
    IonSearchbar,
    ReactiveFormsModule,
    FormsModule,
    ValueAccessorTestComponent
  ]
})
export class SearchbarComponent {

  form = this.fb.group({
    searchbar: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

}
