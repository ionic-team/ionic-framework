import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  userForm: any;
  myValue = 'really long value that overflows to show padding';

  constructor(fb: FormBuilder) {
    this.userForm = fb.group({
      username: [{value: '', disabled: false}, Validators.required],
      password: [{value: '', disabled: false}, Validators.required],
    });
  }

  clicked() {
    console.log('clicked button');
  }
}
