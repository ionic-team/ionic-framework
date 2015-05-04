import {Component, View, bootstrap} from 'angular2/angular2'
import {Nav} from 'ionic/components/nav/nav'
import {Log} from 'ionic/util'
import {FirstPage} from 'pages/first-page'

@Component({ selector: '[ion-app]' })
@View({
  directives: [Nav],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.initial = FirstPage
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
