import {Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View, Content, List} from 'ionic/components';


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Content, List]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
