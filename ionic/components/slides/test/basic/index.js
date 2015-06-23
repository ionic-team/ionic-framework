import {Component} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView} from 'ionic/ionic';


@Component({
  selector: 'ion-app'
})
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  next() {
    console.log('Next');
  }
  prev() {
    console.log('Prev');
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
