import {Component} from 'angular2/angular2';
import {View} from 'angular2/src/core/annotations_impl/view';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
  showAlert() {
    console.log('Show alert');

    Alert.open({
    });
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
