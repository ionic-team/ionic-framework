import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView} from 'ionic/ionic';


@Component({
  selector: 'ion-view'
})
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
