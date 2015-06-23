import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {FormBuilder, Validators, ControlGroup} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {

    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
