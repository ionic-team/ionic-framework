import {Component} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  fruitsForm: ControlGroup;
  grapeDisabled = true;
  grapeChecked = true;
  formResults: any;

  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control(),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control(false),
      "grapeCtrl": new Control(true)
    });
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

ionicBootstrap(E2EApp);
