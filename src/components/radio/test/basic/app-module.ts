import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicApp, IonicModule, RadioButton, RadioGroup } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  currencies: Array<string>;
  items: Array<{description: string, value: any}>;
  relationship: string;
  selectedTime: number = 60;
  someValue: string;

  fruitsCtrl = new FormControl('apple');
  fruitsForm = new FormGroup({
    'fruitsCtrl': this.fruitsCtrl
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
    this.fruitsCtrl.updateValueAndValidity('apple');
  }

  setBanana() {
    this.fruitsCtrl.updateValueAndValidity('banana');
  }

  setCherry() {
    this.fruitsCtrl.updateValueAndValidity('cherry');
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
