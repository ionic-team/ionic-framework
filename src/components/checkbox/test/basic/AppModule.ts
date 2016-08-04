import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicModule, Checkbox } from '../dist';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  fruitsForm: FormGroup;
  grapeDisabled: boolean;
  grapeChecked: boolean;
  kiwiValue: boolean;
  strawberryValue: boolean;
  standAloneChecked: boolean;
  formResults: string;

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
export class E2EApp {
  rootPage = E2EPage;
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
    E2EPage
  ]
})
export class AppModule {}

