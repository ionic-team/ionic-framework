import { Component, NgModule } from '@angular/core';
import { AlertController, IonicApp, IonicModule } from '../../../ionic-angular';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {

  constructor(public alerCtrl: AlertController) { }

  doConfirm() {
    let confirm = this.alerCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present()
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
