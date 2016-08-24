import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ionicBootstrap, Checkbox } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  fruitsForm: FormGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  standAloneChecked: boolean;
  formResults: string;
  dangerColor: string = 'danger';

  constructor() {
    this.fruitsForm = new FormGroup({
      'appleCtrl': new FormControl(true),
      'bananaCtrl': new FormControl(true),
      'cherryCtrl': new FormControl(false),
      'grapeCtrl': new FormControl(true)
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

  kiwiChange(checkbox: Checkbox) {
    console.log('kiwiChange', checkbox);
    this.kiwiValue = checkbox.checked;
  }

  strawberryChange(checkbox: Checkbox) {
    console.log('strawberryChange', checkbox);
    this.strawberryValue = checkbox.checked;
  }

  doSubmit(ev: UIEvent) {
    console.log('Submitting form', this.fruitsForm.value);
    this.formResults = JSON.stringify(this.fruitsForm.value);
    ev.preventDefault();
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = E2EPage;
}

ionicBootstrap(E2EApp);
