import {Component, View, bootstrap} from 'angular2/angular2';
import {Alert} from 'ionic/ionic';


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Alert]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
