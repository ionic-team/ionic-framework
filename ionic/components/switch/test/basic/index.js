import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Switch, Content, Button, List} from 'ionic/ionic';
//import {IONIC_DIRECTIVES} from 'ionic/ionic'

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [FormDirectives].concat([Switch, List, Content, Button])
})
class IonicApp {
  constructor() {

    var fb = new FormBuilder();
    this.form = fb.group({
      enableFun: ['', Validators.required],
      enableIceCream: [false, Validators.required],
      enablePizza: [true, Validators.required]
    });
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}


export function main() {
  bootstrap(IonicApp);
}
