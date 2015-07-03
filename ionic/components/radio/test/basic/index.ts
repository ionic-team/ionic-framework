import {Component} from 'angular2/angular2';

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
