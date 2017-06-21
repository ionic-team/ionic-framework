import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Checkbox } from  '../../../../../../';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  standAloneChecked: boolean;
  formResults: string;
  dangerColor: string = 'danger';

  appleCtrl = new FormControl(true);
  bananaCtrl = new FormControl(true);
  cherryCtrl = new FormControl({value: false, disabled: true});
  grapeCtrl = new FormControl({value: true, disabled: true});

  fruitsForm = new FormGroup({
    'apple': this.appleCtrl,
    'banana': this.bananaCtrl,
    'cherry': this.cherryCtrl,
    'grape': this.grapeCtrl
  });

  public checked: boolean = false;
  public disabled: boolean = false;

  constructor() {
    this.grapeChecked = true;
    this.standAloneChecked = true;
  }

  toggleGrapeChecked() {
    this.grapeChecked = !this.grapeChecked;
  }

  toggleGrapeDisabled() {
    this.fruitsForm.get('grape').enabled ? this.fruitsForm.get('grape').disable() : this.fruitsForm.get('grape').enable();
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
