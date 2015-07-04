import {Component} from 'angular2/angular2';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html'
})
class MyApp {
  constructor() {
    console.log('IonicApp Start')
  }
  doRefresh() {
    console.log('DOREFRESH')
  }
  doPull(amt) {
    console.log('PULLING', amt);
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(MyApp);
}
