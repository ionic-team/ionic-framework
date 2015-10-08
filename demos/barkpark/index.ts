import {FormBuilder, Validators, ControlGroup} from 'angular2/angular2';
import {Log} from 'ionic/util'

import {App, IonicView, NavController} from 'ionic/ionic'


@IonicView({
  templateUrl: 'pages/login.html'
})
class LoginPage {
  constructor( nav: NavController ) {

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


@IonicView({
  templateUrl: 'pages/signup.html'
})
export class SignupPage {
  constructor( nav: NavController ) { //, fb: FormBuilder ) {

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



@IonicView({
  templateUrl: 'pages/app.html'
})
export class AppPage {
  constructor( nav: NavController ) { //, fb: FormBuilder ) {
    this.nav = nav;
    this.streamTab = StreamTab
  }
}

@IonicView({
  templateUrl: 'pages/tabs/home.html'
})
class StreamTab {
  constructor(nav: NavController) {
    this.nav = nav;
    this.posts = [
      {'title': 'Just barked my first bark'},
      {'title': 'Went poopy' }
    ];
  }
  selectPost(post) {
    console.log('Select post', post);
    this.nav.push(PostDetail, {
      post
    }, {
      transition: '3dflip'
    })
  }
}

@IonicView({
  templateUrl: 'pages/post/detail.html'
})
class PostDetail {
  constructor(nav: NavController) {
    this.nav = nav;
    this.title = 'Hello'
  }
  selectItem() {
    this.nav.push(PostDetailTab)
  }
}

@IonicView({
  templateUrl: 'pages/splash.html'
})
class SplashPage {
  constructor(nav: NavController) {
    this.nav = nav;
    window.nav = nav;
  }
  doLogin() {
    this.nav.push(LoginPage);
  }
}


@App({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
class IonicApp {
  constructor() {
    this.rootView = SplashPage;
  }
}
