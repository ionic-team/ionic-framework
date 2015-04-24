import {bootstrap} from 'angular2/core'
import {Component, Template, Parent} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, CongrolGroup} from 'angular2/forms';

import {Log} from 'ionic2/util'

import {NavViewport, View, Button, Input} from 'ionic2/ionic2'

@Component({
  selector: 'login-page'
})
@Template({
  url: 'pages/login.html',
  directives: [View, FormDirectives, Button]
})
export class LoginPage {
  constructor( @Parent() viewport: NavViewport ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    Log.log('LOGIN PAGE')

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
    //this.viewport.push(SecondPage)
  }
  doSignup(event) {
    this.viewport.push(SignupPage)
  }
}

@Component({
  selector: 'signup-page'
})
@Template({
  url: 'pages/signup.html',
  directives: [View, FormDirectives]
})
export class SignupPage {
  constructor( @Parent() viewport: NavViewport ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    Log.log('SIGNUP PAGE')

    var fb = new FormBuilder()

    this.loginForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doLogin(event) {
    this.viewport.pop()
  }
  doSignup(event) {
    Log.log('Doing login')
    event.preventDefault();
    console.log(this.loginForm.value);
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

