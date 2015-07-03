import {Component} from 'angular2/angular2';

import {IonicView} from 'ionic/ionic';


@Component({
  selector: 'ion-app'
})
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.items = [1, 2, 3, 4, 5]
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
