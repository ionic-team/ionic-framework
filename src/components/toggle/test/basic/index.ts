import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ionicBootstrap, Toggle } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  fruitsForm: FormGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  formResults: string;

  constructor() {
    this.fruitsForm = new FormGroup({
      "appleCtrl": new FormControl(false),
      "bananaCtrl": new FormControl(true),
      "cherryCtrl": new FormControl(false),
      "grapeCtrl": new FormControl(true)
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
