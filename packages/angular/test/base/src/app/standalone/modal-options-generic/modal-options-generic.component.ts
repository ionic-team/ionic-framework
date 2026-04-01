import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, ModalController } from '@ionic/angular/standalone';
import type { ModalOptions } from '@ionic/angular/standalone';
import { GenericModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-modal-options-generic',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal Options Generic Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button id="open-modal" (click)="openModal()">
        Open Modal
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton],
})
export class ModalOptionsGenericComponent {
  private modalController = inject(ModalController);

  async openModal() {
    // Regression: ModalOptions<T> must accept a generic type parameter (#31012)
    const opts: ModalOptions<typeof GenericModalComponent> = {
      component: GenericModalComponent,
      componentProps: {
        greeting: 'hello world',
      },
    };

    const modal = await this.modalController.create(opts);
    await modal.present();
  }
}
