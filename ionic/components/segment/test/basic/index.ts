import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/angular2';

import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html',
  providers: [FormBuilder],
  directives: [FORM_DIRECTIVES]
})
class MyApp {
  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });

    this.modelStyle = 'B';
    this.appType = 'free';
  }

  doSubmit(event) {
    console.log('Submitting form', this.myForm.value);
    event.preventDefault();
  }
}
