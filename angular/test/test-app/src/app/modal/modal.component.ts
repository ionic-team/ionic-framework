import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalExampleComponent } from '../modal-example/modal-example.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent {

  onWillDismiss = false;
  onDidDismiss = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalExampleComponent,
      componentProps: {
        value: '123'
      }
    });
    await modal.present();
    modal.onWillDismiss().then(() => {
      NgZone.assertInAngularZone();
      this.onWillDismiss = true;
    });
    modal.onDidDismiss().then(() => {
      NgZone.assertInAngularZone();
      if (!this.onWillDismiss) {
        throw new Error('onWillDismiss should be emited first');
      }
      this.onDidDismiss = true;
    });
  }
}
