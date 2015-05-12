import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {IONIC_DIRECTIVES} from 'ionic/ionic'

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [FormDirectives].concat(IONIC_DIRECTIVES)
})
class IonicApp {
  constructor() {
    var fb = new FormBuilder();
    this.form = fb.group({
      addCats: ['yes', Validators.required]
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
