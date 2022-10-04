import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: 'searchbar.component.html',
})
export class SearchbarComponent {

  form = this.fb.group({
    searchbar: ['', Validators.required]
  })

  constructor(private fb: FormBuilder) { }

}