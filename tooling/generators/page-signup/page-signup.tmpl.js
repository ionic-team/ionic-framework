import {FormBuilder, Validators} from 'angular2/angular2';
import {Log} from 'ionic/util'
import {Page, NavController} from 'ionic/ionic'


@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {
  constructor(nav: NavController) {
    this.nav = nav

    Log.log('SIGNUP PAGE')

    var fb = new FormBuilder()

    this.signupForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doLogin(event) {
    this.nav.pop()
  }
  doSignup(event) {
    Log.log('Doing signup')
    event.preventDefault();
    console.log(this.signupForm.value);

    this.nav.push(AppPage)
  }
}
