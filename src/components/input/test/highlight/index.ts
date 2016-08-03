import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/common';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  loginForm: any;

  login = {
    email: 'help@ionic.io',
    username: 'admin',
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

  submit(ev: UIEvent, value: any) {
    console.log('Submitted', value);
    this.submitted = true;
  }

}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
