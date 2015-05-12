import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab} from 'ionic/ionic'
import {Engine} from 'ionic/engine/engine'
import * as util from 'ionic/util'


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start');

    console.log(Engine.getName(), Engine.is('cordova'));

    Engine.ready().then(() => {
      console.log('Engine ready')
    });

    Engine.fullScreen(true).then((isShown) => {
      console.log('Engine fullScreen', isShown)
    });

    Engine.showStatusBar(true).then((isShown) => {
      console.log('Engine showStatusBar', isShown)
    });

  }
}


export function main() {
  bootstrap(IonicApp);
}
