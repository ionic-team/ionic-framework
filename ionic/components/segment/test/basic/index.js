import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {formDirectives, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html',
  directives: [formDirectives]
})
class IonicApp {
  constructor() {

    this.mapStyle = new Control("hybrid", Validators.required);
    this.form = new ControlGroup({
      "mapStyle": this.mapStyle
    });

    /*
    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
    */
    console.log(this.form);
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
