import {Component, onInit} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView, IonicConfig} from 'ionic/ionic';
import {FirstPage} from './pages/first-page'


@Component({
  selector: 'ion-app'
})
@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
class MyApp {
  constructor() {
    this.rootView = FirstPage;
  }
}

export function main(ionicBootstrap) {
  let myConfig = new IonicConfig();
  ionicBootstrap(MyApp, myConfig);
}
