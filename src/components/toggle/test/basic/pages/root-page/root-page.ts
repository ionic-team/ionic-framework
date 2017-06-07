import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Toggle } from '../../../../../../';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  formResults: string;

  appleCtrl = new FormControl(false);
  bananaCtrl = new FormControl(true);
  cherryCtrl = new FormControl({value: false, disabled: true});
  grapeCtrl = new FormControl({value: true, disabled: true});

  fruitsForm = new FormGroup({
    'apple': this.appleCtrl,
    'banana': this.bananaCtrl,
    'cherry': this.cherryCtrl,
    'grape': this.grapeCtrl
  });

  constructor() {
    this.grapeChecked = true;
    this.grapeDisabled = true;
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.grapeCtrl.enabled ? this.grapeCtrl.disable() : this.grapeCtrl.enable();
  }

  appleChange(toggle: Toggle) {
    console.log('appleChange', toggle);
  }

  bananaChange(toggle: Toggle) {
    console.log('bananaChange', toggle);
  }

  kiwiChange(toggle: Toggle) {
    console.log('kiwiChange', toggle);
    this.kiwiValue = toggle.checked;
  }

  strawberryChange(toggle: Toggle) {
    console.log('strawberryChange', toggle);
    this.strawberryValue = toggle.checked;
  }

  doSubmit(ev: UIEvent) {
    console.log('Submitting form', this.fruitsForm.value);
    this.formResults = JSON.stringify(this.fruitsForm.value);
    ev.preventDefault();
  }
}
