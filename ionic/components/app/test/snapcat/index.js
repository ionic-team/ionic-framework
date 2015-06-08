import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {Nav, Segment, SegmentButton, Slides, Slide, Content, Button, List, Item} from 'ionic/ionic';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [formDirectives, Nav, Segment, SegmentButton, Slides, Slide, Content, Button, List, Item]
})
export class IonicApp {
  constructor() {

    this.filterForm = new ControlGroup({
      filterControl: new Control("")
    });
    /*
    var fb = new FormBuilder();
    this.form = fb.group({
      filter: ['new']
    });
    */
  }
}

export function main() {
  bootstrap(IonicApp);
}
