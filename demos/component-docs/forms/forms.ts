import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/forms';
import {IonicView} from 'ionic/ionic';


@IonicView({
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

