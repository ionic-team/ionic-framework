import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    // var fb = new FormBuilder();
    // this.form = fb.group({
    //   preferredApple: ['mac', Validators.required],
    // });
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
