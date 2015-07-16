import {Component, View} from 'angular2/angular2';

import {Query, QueryList, NgFor} from 'angular2/angular2';
// import {FormBuilder, Validators, NgFormControl, Control, NgControlName, NgControlGroup, ControlContainer} from 'angular2/forms';
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
import {App, Checkbox, Content, List} from 'ionic/ionic';
//import {IONIC_DIRECTIVES} from 'ionic/ionic'

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
