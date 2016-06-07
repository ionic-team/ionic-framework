import {Component} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  fruitsForm: ControlGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  standAloneChecked: boolean;
  formResults: string;

  constructor() {
    this.fruitsForm = new ControlGroup({
      "appleCtrl": new Control(true),
      "bananaCtrl": new Control(true),
      "cherryCtrl": new Control(false),
      "grapeCtrl": new Control(true)
    });

    this.grapeDisabled = true;
    this.grapeChecked = true;
    this.standAloneChecked = true;
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.grapeDisabled = !this.grapeDisabled;
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

ionicBootstrap(E2EPage);
