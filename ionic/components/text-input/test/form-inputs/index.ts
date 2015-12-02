import {App} from 'ionic/ionic';
import {FormBuilder, Validators} from 'angular2/angular2';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      comments: ["", Validators.required]
    });
  }

  submit(ev) {
    console.log("Submitted", this.loginForm.value);
  }

}
