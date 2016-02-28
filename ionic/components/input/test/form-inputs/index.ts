import {App} from 'ionic-angular';
import {FormBuilder, Validators} from 'angular2/common';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ["", Validators.required],
      username: [""],
      password: ["", Validators.required],
      comments: ["", Validators.required]
    });

    this.login = {
      email: 'help@ionic.io',
      username: 'admin'
    };

    this.user = {
      username: 'asdf',
      password: '82'
    };

    this.submitted = false;
  }

  submit(ev, value) {
    console.log("Submitted", value);
    this.submitted = true;
  }

  disable() {
    this.isTextAreaDisabled = !this.isTextAreaDisabled;
  }

}
