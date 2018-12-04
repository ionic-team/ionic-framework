import { Component, Input, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
})
export class ModalExampleComponent {

  @Input() value: string;

  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    NgZone.assertInAngularZone();
    this.willEnter++;
  }
  ionViewDidEnter() {
    NgZone.assertInAngularZone();
    this.didEnter++;
  }
  ionViewWillLeave() {
    NgZone.assertInAngularZone();
    this.willLeave++;
  }
  ionViewDidLeave() {
    NgZone.assertInAngularZone();
    this.didLeave++;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
