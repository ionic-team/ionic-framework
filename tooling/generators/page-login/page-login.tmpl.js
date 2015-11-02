import {FormBuilder, Validators} from 'angular2/angular2';
import {Log} from 'ionic/util'
import {Page, NavController} from 'ionic/ionic'

@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
class <%= jsClassName %> {
  constructor(nav: NavController ) {

    this.nav = nav
    Log.log('LOGIN PAGE', this)

    var fb = new FormBuilder()

    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  doLogin(event) {
    Log.log('Doing login')
    event.preventDefault();
    console.log(this.loginForm.value);
  }

  doSignup(event) {
    this.nav.push(SignupPage)
  }
}
