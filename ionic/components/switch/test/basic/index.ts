import {App} from 'ionic/ionic';
import {
  Control,
  ControlGroup,
  NgForm,
  formDirectives,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgControlName,
  NgFormModel,
  FormBuilder
} from 'angular2/forms';

@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control({"checked": false, "value": "apple"}),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control({"checked": false, "value": 12}),
      "grapeCtrl": new Control("grape")
    });
  }

  doSubmit(ev) {
    console.log('Submitting form', this.fruitsForm.value);
    event.preventDefault();
  }
}
