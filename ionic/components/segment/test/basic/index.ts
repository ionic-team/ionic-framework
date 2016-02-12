import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App, IonicApp} from '../../../../../ionic/ionic';


@App({
  templateUrl: 'main.html',
  providers: [FormBuilder],
  directives: [FORM_DIRECTIVES]
})
class MyApp {
  constructor(fb: FormBuilder, app: IonicApp) {
    this.app = app;
    this.myForm = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });

    this.relationship = 'enemies';
    this.modelStyle = 'B';
    this.appType = 'free';
  }

  onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
  }

  onSegmentSelected(segmentButton) {
    console.log("Segment selected", segmentButton.value);
  }

  doSubmit(event) {
    console.log('Submitting form', this.myForm.value);
    event.preventDefault();
  }
}
