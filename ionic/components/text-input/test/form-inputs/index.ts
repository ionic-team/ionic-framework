import {App} from 'ionic/ionic';
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

    this.login = {};

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

}
