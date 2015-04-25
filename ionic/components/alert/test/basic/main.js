import {Component, View as NgView, bootstrap} from 'angular2/angular2';
import {Alert} from 'ionic/components/alert/alert';


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [Alert]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
