import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/common';

import {App, IonicApp} from 'ionic-angular';


@App({
  templateUrl: 'main.html',
  providers: [FormBuilder],
  directives: [FORM_DIRECTIVES]
})
class MyApp {
  relationship: string = 'enemies';
  modelStyle: string = 'B';
  appType: string = 'free';
  icons: string = 'camera';

  myForm;

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
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
