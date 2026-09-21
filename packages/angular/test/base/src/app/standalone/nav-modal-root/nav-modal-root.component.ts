import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, ModalController } from '@ionic/angular';

import { NavModalRootPageComponent } from './nav-modal-root-page.component';
import { NavWrapperComponent } from './nav-wrapper.component';

@Component({
  selector: 'app-nav-modal-root',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Nav Modal Root</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button id="open-nav-modal" (click)="openModal()">Open Modal</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class NavModalRootComponent {
  private modalController = inject(ModalController);

  async openModal() {
    const modal = await this.modalController.create({
      component: NavWrapperComponent,
      componentProps: {
        rootPage: NavModalRootPageComponent,
      },
    });

    await modal.present();
  }
}
