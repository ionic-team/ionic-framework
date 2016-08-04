import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicModule, RadioButton, RadioGroup } from '../../../dist';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  fruits: FormControl;
  fruitsForm: FormGroup;
  currenciesControl: FormControl; 
  currencyForm: FormGroup;
  currencies: Array<string>;
  items: Array<{description: string, value: any}>;
  relationship: string;
  selectedTime: number = 60;
  someValue: string;

  constructor() {
    this.fruits = new FormControl('apple');

    this.fruitsForm = new FormGroup({
      'fruits': this.fruits
    });

    this.currencies = ['USD', 'EUR'];
    this.currenciesControl = new FormControl('EUR');
    this.currencyForm = new FormGroup({
      'currenciesControl': this.currenciesControl
    });

    this.relationship = 'enemies';

    this.items = [
      { description: 'value undefined', value: undefined },
      { description: 'value false string', value: 'false' },
      { description: 'value false boolean', value: false },
      { description: 'value 0', value: 0 },
    ];
  }

  setApple() {
    this.fruits.updateValue('apple');
  }

  setBanana() {
    this.fruits.updateValue('banana');
  }

  setCherry() {
    this.fruits.updateValue('cherry');
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
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
