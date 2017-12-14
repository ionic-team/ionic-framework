import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { PageOne } from './page-one';

@Component({
  selector: 'app-modal-page',
  template: `
  <ion-app>
    <ion-page class="show-page">
      <ion-header>
        <ion-toolbar>
          <ion-title>Test</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <ion-button (click)="clickMe()">Open Basic Modal</ion-button>
      </ion-content>
    </ion-page>
</ion-app>
  `
})
export class ModalPageComponent {

  constructor(private modalController: ModalController) {
  }

  clickMe() {
    const modal = this.modalController.create({
      component: PageOne
    });
    return modal.present();
  }

}
