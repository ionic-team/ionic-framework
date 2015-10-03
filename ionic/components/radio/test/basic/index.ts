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
} from 'angular2/angular2';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.fruits = new Control("");

    this.fruitsForm = new ControlGroup({
      "fruits": this.fruits
    });
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
