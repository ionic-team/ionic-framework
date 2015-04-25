import {Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View, Tabs, Tab} from 'ionic/ionic';


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
