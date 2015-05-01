import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {Nav} from 'ionic/ionic'
import {SignInPage} from 'pages/sign-in'


@Component({
  selector: '[ion-app]',
})
@NgView({
  templateUrl: 'main.html',
  directives: [Nav]
})
class App {
  constructor() {
    this.initial = SignInPage
  }
}
bootstrap(App)
