import {Component, View as NgView, bootstrap} from 'angular2/angular2';
import {ActionMenu} from 'ionic/components/action-menu/action-menu';


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [ActionMenu]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
