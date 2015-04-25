import {Component, View, bootstrap} from 'angular2/angular2';
import {ActionMenu} from 'ionic/ionic';


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [ActionMenu]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
