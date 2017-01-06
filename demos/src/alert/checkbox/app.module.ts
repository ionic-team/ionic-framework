import { Component, NgModule } from '@angular/core';
import { AlertController, IonicApp, IonicModule } from '../../../ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  testCheckboxOpen: boolean;
  testCheckboxResult;

  constructor(public alertCtrl: AlertController) { }

  doCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Which planets have you visited?');

    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Coruscant',
      value: 'value3'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Endor',
      value: 'value4'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Hoth',
      value: 'value5'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Jakku',
      value: 'value6'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Naboo',
      value: 'value6'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Takodana',
      value: 'value6'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Tatooine',
      value: 'value6'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });
    alert.present().then(() => {
      this.testCheckboxOpen = true;
    });
  }
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

@NgModule({
  declarations: [
    ApiDemoApp,
    ApiDemoPage
  ],
  imports: [
    IonicModule.forRoot(ApiDemoApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ApiDemoPage
  ]
})
export class AppModule {}
