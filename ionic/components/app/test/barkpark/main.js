//import {Router} from 'ionic/routing/router'
import {For, Component, View, Parent, bootstrap} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'

import {
  Router, Routable, List, Item, Nav, NavController,
  Toolbar, ToolbarTitle, Button, Input, Tabs,
  Tab, Content, Aside
} from 'ionic/ionic'

@Component()
@View({
  templateUrl: 'pages/login.html',
  directives: [FormDirectives, Button, Input, Content, Toolbar, ToolbarTitle]
})
export class LoginPage {
  constructor( @Parent() viewport: NavController ) {

    this.viewport = viewport
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

    //this.viewport.push(SecondPage)
  }

  doSignup(event) {
    this.viewport.push(SignupPage)
  }
}

new Routable(LoginPage, {
  url: '/login',
  tag: 'login'
})

@Component({
  selector: 'signup-page'
})
@View({
  templateUrl: 'pages/signup.html',
  directives: [FormDirectives, Button, Input]
})
export class SignupPage {
  constructor( @Parent() viewport: NavController ) { //, fb: FormBuilder ) {

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
@View({
  templateUrl: 'pages/app.html',
  directives: [FormDirectives, Button, Input, Tabs, Tab]
})
export class AppPage {
  constructor( @Parent() viewport: NavController ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    this.streamTab = StreamTab
  }
}

@Component({ selector: 'stream-tab' })
@View({
  templateUrl: 'pages/tabs/home.html',
  directives: [For, Content, List, Item]
})
class StreamTab {
  constructor(@Parent() nav: NavController) {
    this.nav = viewport;
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

@Component({ selector: 'post-detail-tab' })
@View({
  templateUrl: 'pages/post/detail.html',
  directives: [Content]
})
class PostDetail {
  constructor(@Parent() nav: NavController) {
    this.nav = viewport;
    this.title = 'Hello'
  }
  selectItem() {
    this.nav.push(PostDetailTab)
  }
}

@Component()
@View({
  templateUrl: 'pages/splash.html',
  directives: [Content]
})
class SplashPage {
  constructor(@Parent() nav: NavController) {
    this.nav = nav;
    window.nav = nav;
  }
}


/**
 * Main app entry point
 */
@Component({ selector: '[ion-app]' })
@View({
  directives: [Nav],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.firstPage = SplashPage//AppPage//LoginPage

    setTimeout(() => {
      var nav = window.nav;

      var route = Router;//new Router()

      /*
      route.map('login', {
        url: '/login',
        paramResolver(urlParts) {
          return Login(urlParts.id);
        }
      })
      */

      route.on('/login', (data) => {

        nav.push(LoginPage, null, {
          animate: false
        })

      })

      route.on('/post/:id', (data) => {
        console.log('ROUTE: Post page', data)
        nav.push(PostDetail, data);
      })

      route.otherwise('/login');

    }, 200);
  }
}

bootstrap(IonicApp);
