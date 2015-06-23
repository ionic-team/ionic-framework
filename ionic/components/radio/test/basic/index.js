import {Component} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    // var fb = new FormBuilder();
    // this.form = fb.group({
    //   preferredApple: ['mac', Validators.required],
    // });
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
