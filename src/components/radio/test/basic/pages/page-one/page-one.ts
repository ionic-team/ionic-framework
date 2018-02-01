import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IonicPage, RadioButton, RadioGroup } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  currencies: Array<string>;
  items: Array<{description: string, value: any}>;
  relationship: string;
  selectedTime: number = 60;
  someValue: string;

  fruitsCtrl = new FormControl('apple');
  fruitsForm = new FormGroup({
    'fruitsCtrl': this.fruitsCtrl
  });

  friendsCtrl = new FormControl({value: 'enemies', disabled: true});
  friendsForm = new FormGroup({
    'friendsCtrl': this.friendsCtrl
  });

  currenciesControl = new FormControl('EUR');
  currencyForm = new FormGroup({
    'currenciesControl': this.currenciesControl
  });

  constructor() {
    this.currencies = ['USD', 'EUR'];
    this.relationship = 'enemies';

    this.items = [
      { description: 'value undefined', value: undefined },
      { description: 'value false string', value: 'false' },
      { description: 'value false boolean', value: false },
      { description: 'value 0', value: 0 },
    ];
  }

  setApple() {
    this.fruitsCtrl.setValue('apple');
    this.fruitsCtrl.updateValueAndValidity();
  }

  setBanana() {
    this.fruitsCtrl.setValue('banana');
    this.fruitsCtrl.updateValueAndValidity();
  }

  setCherry() {
    this.fruitsCtrl.setValue('cherry');
    this.fruitsCtrl.updateValueAndValidity();
  }

  doSubmit(ev: UIEvent) {
    console.log('Submitting form', this.fruitsForm.value);
    ev.preventDefault();
  }

  petChange(radioGroup: RadioGroup) {
    console.log('petChange', radioGroup);
  }

  dogSelect(radioButton: RadioButton) {
    console.log('dogSelect', radioButton);
  }

  catSelect(radioButton: RadioButton) {
    console.log('catSelect', radioButton);
  }

  turtleSelect(radioButton: RadioButton) {
    console.log('turtleSelect', radioButton);
  }
}
