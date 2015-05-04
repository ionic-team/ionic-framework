import {Component, View, bootstrap} from 'angular2/angular2'
import {Tabs, Tab} from 'ionic/ionic'
import {engine} from 'ionic/engine/engine'
import * as util from 'ionic/util'


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab]
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
