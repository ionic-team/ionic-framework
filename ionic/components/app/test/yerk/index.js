import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab, Content} from 'ionic/ionic'
import {Engine} from 'ionic/engine/engine'
import * as util from 'ionic/util'


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab, Content]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start');
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
