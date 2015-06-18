import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

//import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';
import {RadioGroup, RadioButton, Content, Button, List} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [RadioGroup, RadioButton, List, Content, Button]
})
export default class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    // var fb = new FormBuilder();
    // this.form = fb.group({
    //   preferredApple: ['mac', Validators.required],
    // });
  }
}
