import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicApp, IonicModule, Toggle } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  formResults: string;

  appleCtrl = new FormControl(false);
  bananaCtrl = new FormControl(true);
  cherryCtrl = new FormControl(false);
  grapeCtrl = new FormControl(true);

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
