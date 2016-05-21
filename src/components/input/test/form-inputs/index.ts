import {App} from '../../../../../src';
import {FormBuilder, Validators, Control} from '@angular/common';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  loginForm: any;

  login = {
    email: 'help@ionic.io',
    username: 'admin'
  };

  user = {
    username: 'asdf',
    password: '82'
  };

  submitted: boolean = false;
  isTextAreaDisabled: boolean;

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ["", Validators.compose([
        Validators.required,
        this.emailValidator
      ])],
      username: [""],
      password: ["", Validators.required],
      comments: ["", Validators.required]
    });
  }

  emailValidator(control) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  submit(ev, value) {
    console.log("Submitted", value);
    this.submitted = true;
  }

  disable() {
    this.isTextAreaDisabled = !this.isTextAreaDisabled;
  }

}
