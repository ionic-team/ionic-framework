import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App, Page} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html',
  providers: [FormBuilder],
  directives: [FORM_DIRECTIVES]
})
class SegmentPage {
  constructor(fb: FormBuilder) {
    this.signInType = 'new';
  }
}

@App({
  pages: [SegmentPage],
  template: `<ion-nav [root]="root"></ion-nav>`
})
class MyApp {
  constructor() {
    this.root = SegmentPage;
  }
}
