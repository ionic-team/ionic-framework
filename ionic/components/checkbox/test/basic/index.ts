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

    //  var fb = new FormBuilder();
    //  this.controls = {
    //    appleCtrl : ['', Validators.required],
    //    bananaCtrl: ['', Validators.required],
    //    grapeCtrl: ['', Validators.required],
    //    cherryCtrl: ['', Validators.required]
    //  };
    //
    //  this.fruitsForm = fb.group(this.controls);

    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control("", isChecked),
      "bananaCtrl": new Control("", isChecked),
      // "bananaCtrl": new Control("BANANA", isChecked),
      // "grapeCtrl": new Control("GRAPE", isChecked),
      // "cherryCtrl":  new Control("CHERRY", isChecked)
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
