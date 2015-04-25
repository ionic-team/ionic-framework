import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {NavViewport} from 'ionic/components/nav-viewport/nav-viewport'
import {Log} from 'ionic/util'
import {FirstPage} from 'app/pages/first-page'

@Component({ selector: '[ion-app]' })
@NgView({
  directives: [NavViewport],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.initial = FirstPage
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
