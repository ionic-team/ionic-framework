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

    this.submitted = false;
  }

  submit(ev) {
    console.log("Submitted", this.loginForm.value);
    this.submitted = true;
  }

}
