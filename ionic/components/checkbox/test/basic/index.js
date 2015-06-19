import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {Checkbox, Content, List} from 'ionic/ionic';
//import {IONIC_DIRECTIVES} from 'ionic/ionic'

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Checkbox, List, Content]
})
export default class IonicApp {
  constructor() {
    // var fb = new FormBuilder();
    // this.form = fb.group({
    //   addCats: ['yes', Validators.required]
    // });
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}

