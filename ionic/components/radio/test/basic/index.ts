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
    this.fruitsGroup1 = new ControlGroup({
      "appleCtrl": new Control("", isChecked),
      "bananaCtrl": new Control("", isChecked)
    });
    this.fruitsGroup2 = new ControlGroup({
      "grapeCtrl": new Control("", isChecked),
      "cherryCtrl": new Control("", isChecked)
    });

    this.fruitsForm = new ControlGroup({
      "fruitGroup1": this.fruitsGroup1,
      "fruitGroup2": this.fruitsGroup2
    });

    function isChecked(ctrl) {
      if (ctrl.checked) {
        return null;
      } else {
        return {
          'notChecked': true
        }
      }
    }
  }

  doSubmit(event) {
    console.log('Submitting form', this.fruitsForm.value);
    event.preventDefault();
  }
}
