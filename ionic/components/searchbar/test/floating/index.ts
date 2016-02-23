import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App} from 'ionic-angular';

@App({
  templateUrl: 'main.html',
  directives: [FORM_DIRECTIVES]
})
class E2EApp {
  defaultSearch: string = 'test';
  customPlaceholder: string = '';
  defaultCancel: string = '';

  constructor() {

  }

  onClearSearchbar(searchbar) {
    console.log("Clicked clear input on", searchbar.value);
  }

  onCancelSearchbar(searchbar) {
    console.log("Clicked cancel button with", searchbar.value);
  }

  triggerInput(searchbar) {
    console.log("Triggered input", searchbar.value);
  }

  inputBlurred(searchbar) {
    console.log("Blurred input", searchbar.value);
  }

  inputFocused(searchbar) {
    console.log("Focused input", searchbar.value);
  }
}
