import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {FormBuilder, Validators, formDirectives} from 'angular2/forms';

import {IonicView} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@IonicView({
  templateUrl: 'main.html',
  directives: [formDirectives]
})
class IonicApp {
  constructor() {
     var fb = new FormBuilder();
     this.fruitsForm = fb.group({
       appleCtrl: ['', Validators.required],
       bananaCtrl: ['', Validators.required],
       grapeCtrl: ['', Validators.required],
       cherryCtrl: ['', Validators.required]
     });
     debugger;
  }

  doSubmit(event) {
    console.log('Submitting form', this.fruitsForm.value);
    event.preventDefault();
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
