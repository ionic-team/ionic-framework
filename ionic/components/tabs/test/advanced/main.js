import {Component, View, bootstrap} from 'angular2/angular2'
import {NavViewport, Aside} from 'ionic/components'
import {SignInPage} from 'app/pages/sign-in'

@Component({
  selector: '[ion-app]',
})
@View({
  templateUrl: 'main.html',
  directives: []
})
class App {
  constructor() {
    this.initial = SignInPage
  }
}
bootstrap(App)
