import {formDirectives, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';

import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html',
  appInjector: [FormBuilder],
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
