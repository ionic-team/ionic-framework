import {Component, View, bootstrap} from 'angular2/angular2'
import {Button} from 'ionic/components/button/button'

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Button]
})
class IonicApp {
  constructor() {
  }
}

bootstrap(IonicApp)
