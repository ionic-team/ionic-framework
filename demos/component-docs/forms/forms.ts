import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/angular2';
import {Page} from 'ionic/ionic';


@Page({
  templateUrl: 'forms/forms.html',
  bindings: [FormBuilder]
})
export class FormsPage {

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

