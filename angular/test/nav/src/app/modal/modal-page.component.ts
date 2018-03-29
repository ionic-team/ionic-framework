import { Component, ViewEncapsulation } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ModalPageToPresent } from './modal-page-to-present';

@Component({
  selector: 'app-modal-page',
  template: `
  <ion-app>
      <ion-header>
        <ion-toolbar>
          <ion-title>Modal</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <ion-button (click)="clickMe()">Open Basic Modal</ion-button>
      </ion-content>
</ion-app>,
  `,
  encapsulation: ViewEncapsulation.None
})
export class ModalPageComponent {

  constructor(private modalController: ModalController) {
  }

  async clickMe() {
    const modal = await this.modalController.create({
      component: ModalPageToPresent
    });
    return modal.present();
  }
}
