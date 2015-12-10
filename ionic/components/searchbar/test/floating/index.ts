import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/searchbar/searchbar';

@App({
  templateUrl: 'main.html',
  directives: [FORM_DIRECTIVES]
})
class E2EApp {
  defaultSearch: string = 'filter';
  customPlaceholder: string;
  defaultCancel: string;
  customCancel: string;
  customCancelLong: string;
  customCancelAction: string;
  clickedCustomAction: boolean = false;

  constructor() {

  }

  myCancelAction(event, query) {
    console.log("Clicked cancel action with", query);
    this.clickedCustomAction = true;
  }

  triggerInput() {
    // The defaultSearch doesn't get updated before this function is called
    // so we have to wrap it in a timeout
    setTimeout(() => {
      console.log(this.defaultSearch);
    });
  }
}
