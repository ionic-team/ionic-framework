//import {Router} from 'ionic/routing/router'
import {For, Component, View as NgView, Parent, bootstrap} from 'angular2/angular2'
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Log} from 'ionic/util'
import {Router, List, Item, Nav, View, Button, Input, Tabs, Tab, Content, Aside} from 'ionic/ionic'

@Component({
  selector: 'login-page'
})
@NgView({
  templateUrl: 'pages/login.html',
  directives: [View, FormDirectives, Button, Input]
})
export class LoginPage {
  constructor( @Parent() viewport: Nav ) { //, fb: FormBuilder ) {

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
@NgView({
  templateUrl: 'pages/signup.html',
  directives: [View, FormDirectives, Button, Input]
})
export class SignupPage {
  constructor( @Parent() viewport: Nav ) { //, fb: FormBuilder ) {

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
@NgView({
  templateUrl: 'pages/app.html',
  directives: [View, FormDirectives, Button, Input, Tabs, Tab]
})
export class AppPage {
  constructor( @Parent() viewport: Nav ) { //, fb: FormBuilder ) {
    this.viewport = viewport
    this.streamTab = StreamTab
  }
}

@Component({ selector: 'stream-tab' })
@NgView({
  templateUrl: 'pages/tabs/home.html',
  directives: [For, View, Content, List, Item]
})
class StreamTab {
  constructor(@Parent() viewport: Nav) {
    //this.navPane = navPane;
    this.navPane = viewport;
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
@NgView({
  templateUrl: 'pages/post/detail.html',
  directives: [View, Content]
})
class PostDetail {
  constructor(@Parent() viewport: Nav) {
    this.navPane = viewport;
    this.title = 'Hello'
  }
  selectItem() {
    this.navPane.push(PostDetailTab)
  }
}

@Component({ selector: 'splash-page' })
@NgView({
  templateUrl: 'pages/splash.html',
  directives: [View, Content]
})
class SplashPage {
  constructor(@Parent() viewport: Nav) {
    this.navPane = viewport;
    window.navPane = viewport;
  }
}


/**
 * Main app entry point
 */
@Component({ selector: '[ion-app]' })
@NgView({
  directives: [Nav],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.firstPage = SplashPage//AppPage//LoginPage

    setTimeout(() => {
      var nav = window.navPane;

      var route = new Router()

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
