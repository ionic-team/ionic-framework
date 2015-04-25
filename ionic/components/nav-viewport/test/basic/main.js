import {Component, View, bootstrap} from 'angular2/angular2'
import {NavViewport} from 'ionic/components'
import {Log} from 'ionic/util'
import {FirstPage} from 'app/pages/first-page'

@Component({ selector: '[ion-app]' })
@View({
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
