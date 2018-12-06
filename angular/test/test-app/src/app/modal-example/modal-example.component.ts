import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
})
export class ModalExampleComponent implements OnInit {

  @Input() value: string;

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    NgZone.assertInAngularZone();
    this.onInit++;
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
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
