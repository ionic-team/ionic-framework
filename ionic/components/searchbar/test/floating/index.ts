import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/searchbar/searchbar';

@App({
  templateUrl: 'main.html',
  directives: [FORM_DIRECTIVES]
})
class E2EApp {
  defaultSearch: string = 'test';
  customPlaceholder: string = '';
  defaultCancel: string = '';
  customCancel: string = '';
  customCancelAction: string = '';

  constructor() {

  }

  onClearSearchbar(searchbar) {
    console.log("Clicked clear input on", searchbar);
  }

  onCancelSearchbar(searchbar) {
    console.log("Clicked cancel button with", searchbar);
  }

  triggerInput(searchbar) {
    console.log("Triggered input", searchbar);
  }
}
