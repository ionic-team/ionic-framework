import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  loginForm: any;

  login = {
    email: 'help@ionic.io',
    username: 'admin',
    password: '',
    comments: '',
    inset: ''
  };

  submitted: boolean = false;

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([
        Validators.required,
        this.emailValidator
      ])],
      username: [''],
      password: ['', Validators.required],
      comments: ['', Validators.required],
      inset: ['', Validators.required]
    });
  }

  emailValidator(control: any) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  submit(_: UIEvent, value: any) {
    console.log('Submitted', value);
    this.submitted = true;
  }

}
