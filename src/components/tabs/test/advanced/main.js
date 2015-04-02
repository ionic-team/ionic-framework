import {Component, Template, bootstrap} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components'
import {SignInPage} from 'app/pages/sign-in'

@Component({
  selector: '[ion-app]'
})
@Template({
  inline: '<ion-nav-viewport [initial]="initial"></ion-nav-viewport>',
  directives: [NavViewport]
})
class App {
  constructor() {
    this.initial = SignInPage
  }
}
bootstrap(App)
