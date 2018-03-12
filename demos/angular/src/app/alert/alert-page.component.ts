import { Component } from '@angular/core';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert-page',
  template: `
  <ion-app>
  <ion-page class="show-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-button (click)="clickMe()">Open Basic Alert</ion-button>
    </ion-content>
  </ion-page>
</ion-app>
  `
})
export class AlertPageComponent {

  constructor(private alertController: AlertController) {

  }

  clickMe() {
    const alert = this.alertController.create({
      title: 'ohhhh snap',
      message: 'Ive been injected via Angular keeping the old api',
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: () => {
            // console.log('cancel');
          }
        },
        {
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            // console.log('okay');
          }
        }
      ]

    });
    alert.present().then(() => {
      // return alert.dismiss();

    }).then(() => {
      console.log('dismissed');
    });
  }

}
