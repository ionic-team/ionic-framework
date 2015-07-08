import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
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
