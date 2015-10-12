import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/angular2';

import {App} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';

@App({
  templateUrl: 'main.html',
  directives: [FORM_DIRECTIVES]
})
class IonicApp {
  defaultSearch: string;
  customPlaceholder: string;
  defaultCancel: string;
  customCancel: string;
  customCancelLong: string;
  customCancelAction: string;
  clickedCustomAction: boolean = false;

  constructor() {

  }

  myCancelAction(event, model) {
    console.log("TODO get app property");
  }
}
