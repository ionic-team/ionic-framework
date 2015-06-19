import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
