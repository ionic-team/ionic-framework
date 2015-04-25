import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {NavViewport, Aside} from 'ionic/ionic'
import {SignInPage} from 'app/pages/sign-in'


@Component({
  selector: '[ion-app]',
})
@NgView({
  templateUrl: 'main.html',
  directives: [NavViewport, Aside]
})
class App {
  constructor() {
    this.initial = SignInPage
  }
}
bootstrap(App)
