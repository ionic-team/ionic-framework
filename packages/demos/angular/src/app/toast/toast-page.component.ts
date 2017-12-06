import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-toast-page',
  template: `
  <ion-app>
  <ion-page class="show-page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-button (click)="clickMe()">Open Basic Toast</ion-button>
    </ion-content>
  </ion-page>
</ion-app>
  `
})
export class ToastPageComponent {

  constructor(private toastController: ToastController) {

  }

  clickMe() {
    const toast = this.toastController.create({
      closeButtonText: 'close dat toast',
      duration: 1000,
      message: 'Howdy ho toasty neighbor',
      position: 'bottom'
    });
    toast.present();
  }

}
