import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';
//import {Switch, Form, List, Label, Item, Input, Content} from 'ionic/ionic';
import {IONIC_DIRECTIVES} from 'ionic/ionic'

console.log([formDirectives].concat(IONIC_DIRECTIVES));

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives].concat(IONIC_DIRECTIVES)
})
class IonicApp {
  constructor() {
    var fb = new FormBuilder();
    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      description: ['', Validators.required],
      note : ['', Validators.required]
    });
  }

  deleteClicked() {
    alert('Deleting');
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
