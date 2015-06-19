import {NgSwitch, NgSwitchWhen} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Segment, SegmentButton, Content} from 'ionic/ionic';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives].concat([Segment, SegmentButton, Content, NgSwitch, NgSwitchWhen])
})
export default class IonicApp {
  constructor() {

    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
  }

  doSubmit(event) {
    console.log('Submitting form', this.form.value);
    event.preventDefault();
  }
}
