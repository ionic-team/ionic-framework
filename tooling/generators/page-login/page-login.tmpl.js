import {FormBuilder, Validators} from 'angular2/angular2';
import {Page, NavController} from 'ionic/ionic'


@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
class <%= jsClassName %> {
  constructor(nav: NavController ) {
    this.nav = nav;

    var fb = new FormBuilder();

    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  doLogin() {
    console.log(this.loginForm.value);
  }

  doSignup() {
    this.nav.push(SignupPage)
  }

}
