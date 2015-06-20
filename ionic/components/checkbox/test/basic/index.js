import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, formDirectives} from 'angular2/forms';
import {Checkbox, Content, List} from 'ionic/ionic';
//import {IONIC_DIRECTIVES} from 'ionic/ionic'

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives].concat([Checkbox, List, Content])
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
