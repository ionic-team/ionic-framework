import {App} from '../../../../../ionic/ionic';
import {
  Control,
  ControlGroup,
  NgForm,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgControlName,
  NgFormModel,
  FormBuilder
} from 'angular2/common';

@App({
  templateUrl: 'main.html'
})
class E2EApp {
  fruitsForm: ControlGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiModel: boolean;
  strawberryModel: boolean;
  formResults: string;

  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control(false),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control(false),
      "grapeCtrl": new Control(true)
    });

    this.grapeChecked = true;
    this.grapeDisabled = true;

    this.kiwiModel = true;
    this.strawberryModel = false;
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.grapeDisabled = !this.grapeDisabled;
  }

  doSubmit(ev) {
    console.log('Submitting form', this.fruitsForm.value);
    this.formResults = JSON.stringify(this.fruitsForm.value);
    ev.preventDefault();
  }
}
