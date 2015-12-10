import {App} from 'ionic/ionic';
import {
  Control,
  ControlGroup,
  NgForm,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgControlName,
  NgFormModel,
  FormBuilder
} from 'angular2/common';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.fruits = new Control("");

    this.fruitsForm = new ControlGroup({
      "fruits": this.fruits
    });

    this.currenciesControl = new Control("");

    this.currencyForm = new ControlGroup({
      "currenciesControl": this.currenciesControl
    });

    this.currencies = ['USD', 'EUR'];
    this.selectedCurrency = 'EUR';

    this.relationship = 'friends';

  }

  setApple() {
    this.fruits.updateValue("apple");
  }

  setBanana() {
    this.fruits.updateValue("banana");
  }

  setCherry() {
    this.fruits.updateValue("cherry");
  }

  doSubmit(event) {
    console.log('Submitting form', this.fruitsForm.value);
    event.preventDefault();
  }
}
