import {Component, Template, bootstrap} from 'angular2/angular2'
import {NavViewport, Aside} from 'ionic2/components'
import {SignInPage} from 'app/pages/sign-in'

@Component({
  selector: '[ion-app]'
})
@Template({
  url: 'main.html',
  directives: [NavViewport, Aside]
})
class App {
  constructor() {
    this.initial = SignInPage
  }
}
bootstrap(App)
