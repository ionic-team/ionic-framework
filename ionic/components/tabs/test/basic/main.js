import {Component, View as NgView, bootstrap} from 'angular2/angular2'
import {View, Tabs, Tab} from 'ionic/ionic'
import {engine} from 'ionic/engine/engine'
import * as util from 'ionic/util'


@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start');

    console.log(engine.getName(), engine.is('cordova'));

    engine.ready().then(() => {
      console.log('engine ready')
    });

    engine.fullScreen(true).then((isShown) => {
      console.log('fullScreen', isShown)
    });

    engine.showStatusBar(true).then((isShown) => {
      console.log('showStatusBar', isShown)
    });

  }
}

bootstrap(IonicApp);
