import {Component, View, bootstrap} from 'angular2/angular2';
import {Tabs, Tab} from 'ionic/ionic';


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
