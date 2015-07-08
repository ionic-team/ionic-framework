import {FormBuilder, Validators} from 'angular2/forms';

import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {

    var fb = new FormBuilder();
    this.form = fb.group({
      enableFun: ['', Validators.required],
      enableIceCream: [false, Validators.required],
      enablePizza: [true, Validators.required]
    });
  }

  doSubmit(ev) {
    console.log('Submitting form', this.form.value);
    ev.preventDefault();
  }
}
