import {FORM_DIRECTIVES, FormBuilder, forwardRef, Validators, Control, ControlGroup} from 'angular2/angular2';
import {Page} from 'ionic/ionic';
import {AndroidAttribute} from '../../helpers';

@Page({
  templateUrl: 'labels/basic/template.html',
  providers: [FormBuilder],
  directives: [forwardRef(() => AndroidAttribute)]
})
export class BasicPage {

  constructor() {
    this.form = new ControlGroup({
      firstName: new Control("", Validators.required),
      lastName: new Control("", Validators.required)
    });
  }

  processForm(event) {
    // TODO: display input in a popup
    console.log(event);
  }

}
