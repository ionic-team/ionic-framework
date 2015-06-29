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

  var routes = {
    FirstPage: {
      url: 'firstpage',
      module: './first-page',
    },
    SecondPage: {
      url: 'secondpage',
      module: './second-page'
    },
    ThirdPage: {
      url: 'thirdpage',
      module: './third-page'
    },
  };

  let myConfig = new IonicConfig();

  //myConfig.routes(routes);

  ionicBootstrap(MyApp, myConfig, routes);
}
