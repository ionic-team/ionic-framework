import {Component} from 'angular2/angular2';
import {formDirectives, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';


@Component({
  selector: 'ion-app',
  appInjector: [FormBuilder]
})
@IonicView({
  templateUrl: 'main.html',
  directives: [formDirectives]
})
class IonicApp {
  constructor(fb: FormBuilder) {

    this.myForm = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
    console.log(this.myForm);
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
