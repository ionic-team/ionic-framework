import {Component} from 'angular2/angular2';

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
