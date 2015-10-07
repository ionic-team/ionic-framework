import {NgControl} from 'angular2/angular2';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';

@App({
  templateUrl: 'main.html',
  bindings: [NgControl, FormBuilder],
  directives: [FORM_DIRECTIVES]
})
class IonicApp {
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      searchQuery: ['', Validators.required]
    });
    this.toolbarForm = fb.group({
      toolbarSearchQuery: ['', Validators.required]
    })
  }
  myCancelAction = function() {
    console.log('myCancelAction');
    alert("My custom action!");
  }
}
