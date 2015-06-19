import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Alert} from 'ionic/components/alert/alert';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Alert]
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
