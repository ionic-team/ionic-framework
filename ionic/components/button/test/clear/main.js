import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {Button} from 'ionic/components/button/button'


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [Button]
})
class IonicApp {}

bootstrap(IonicApp)
