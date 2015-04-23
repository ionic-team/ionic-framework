import {bootstrap} from 'angular2/core'
import {Component, Template, Parent} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, CongrolGroup} from 'angular2/forms';

import {Log} from 'ionic2/util'

import {NavViewport, View} from 'ionic2/ionic2'

class LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'login-page'
})
@Template({
  url: 'pages/login.html',
  directives: [View, FormDirectives]
})
export class LoginPage {
  constructor( @Parent() viewport: NavViewport ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    Log.log('LOGIN PAGE')

    var fb = new FormBuilder()
    var loginFormModel = new LoginForm()

    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    /*
    this.loginForm = new FormControlGroup('form', [
      new FormControl('email'),
      new FormControl('password')
    ]);
    */

    /*
    this.loginForm.readFrom({
    });
    */
  }

  doLogin() {
    Log.log('Doing login')
    return false
    //this.viewport.push(SecondPage)
  }
}

@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavViewport],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    this.firstPage = LoginPage
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

