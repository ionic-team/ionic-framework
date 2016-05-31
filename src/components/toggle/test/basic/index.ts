import {Component} from '@angular/core';
import {Control, ControlGroup, NgFormModel} from '@angular/common';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  fruitsForm: ControlGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
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
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.grapeDisabled = !this.grapeDisabled;
  }

  appleChange(ev) {
    console.log('appleChange', ev);
  }

  bananaChange(ev) {
    console.log('bananaChange', ev);
  }

  kiwiChange(ev) {
    console.log('kiwiChange', ev);
    this.kiwiValue = ev.checked;
  }

  strawberryChange(ev) {
    console.log('strawberryChange', ev);
    this.strawberryValue = ev.checked;
  }

  doSubmit(ev) {
    console.log('Submitting form', this.fruitsForm.value);
    this.formResults = JSON.stringify(this.fruitsForm.value);
    ev.preventDefault();
  }
}

ionicBootstrap(E2EApp);
