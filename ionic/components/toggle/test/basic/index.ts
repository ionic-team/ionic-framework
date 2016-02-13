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
  kiwiModel: boolean;
  strawberryModel: boolean;
  formResults: string;

  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control(),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control(false),
      "grapeCtrl": new Control(true)
    });

    this.grapeDisabled = true;

    this.kiwiModel = false;
    this.strawberryModel = true;
  }

  toggleGrapeChecked() {
    this.fruitsForm.controls['grapeCtrl'].updateValue( !this.fruitsForm.controls['grapeCtrl'].value )
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
