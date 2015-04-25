import {bootstrap} from 'angular2/core'
import {For, Component, Template, Parent} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, CongrolGroup} from 'angular2/forms';

import {Log} from 'ionic2/util'
import {Router} from 'ionic2/routing/router'

import {List, Item, NavViewport, View, Button, Input, Tabs, Tab, Content, NavPane, Aside} from 'ionic2/ionic2'

@Component({
  selector: 'login-page'
})
@Template({
  url: 'pages/login.html',
  directives: [View, FormDirectives, Button, Input]
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
  directives: [View, FormDirectives, Button, Input]
})
export class SignupPage {
  constructor( @Parent() viewport: NavViewport ) { //, fb: FormBuilder ) {

    this.viewport = viewport
    Log.log('SIGNUP PAGE')

    var fb = new FormBuilder()

    this.signupForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doLogin(event) {
    this.viewport.pop()
  }
  doSignup(event) {
    Log.log('Doing signup')
    event.preventDefault();
    console.log(this.signupForm.value);

    this.viewport.push(AppPage)
    //this.viewport.push(SecondPage)
  }
}



@Component({
  selector: 'app-page'
})
@Template({
  url: 'pages/app.html',
  directives: [View, FormDirectives, Button, Input, Tabs, Tab]
})
export class AppPage {
  constructor( @Parent() viewport: NavViewport ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    this.streamTab = StreamTab
  }
}

@Component({ selector: 'stream-tab' })
@Template({
  url: 'pages/tabs/home.html',
  directives: [For, View, Content, List, Item]
})
class StreamTab {
  constructor(navPane: NavPane) {
    this.navPane = navPane;
    this.posts = [
      {'title': 'Just barked my first bark'},
      {'title': 'Went poopy' }
    ];
  }
  selectPost(post) {
    console.log('Select post', post);
    this.navPane.push(PostDetail, {
      post
    }, {
      transition: '3dflip'
    })
  }
}

@Component({ selector: 'post-detail-tab' })
@Template({
  url: 'pages/post/detail.html',
  directives: [View, Content]
})
class PostDetail {
  constructor(navPane: NavPane) {
    this.navPane = navPane
    this.title = 'Hello'
  }
  selectItem() {
    this.navPane.push(PostDetailTab)
  }
}

@Component({ selector: 'splash-page' })
@Template({
  url: 'pages/splash.html',
  directives: [View, Content]
})
class SplashPage {
  constructor(navPane: NavPane) {
    window.navPane = navPane;
  }
}



/**
 * Main app entry point
 */
@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavViewport],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    this.firstPage = SplashPage//AppPage//LoginPage

    setTimeout(function() {
      // TODO: HACK
      var nav = window.navPane;

      var route = new Router()

      route.on('/login', (e) => {
        console.log('ROUTE: Login page')
        nav.push(LoginPage, {
          sync: true
        })
      })
      route.on('/post/:id', (match) => {
        console.log('ROUTE: Post page', match)
        nav.push(PostDetail);
      })

      /*
      route.on('/signup', (e) => {
        console.log('ROUTE: Signup page')
        nav.push(SignupPage)
      })
      */
    }, 2000);

    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

