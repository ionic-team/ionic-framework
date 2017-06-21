import { Component } from '@angular/core';
import { ModalController } from '../../../../../src';

import { ModalPage } from '../modal-page/modal-page';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  myParam = '';

  constructor(public modalCtrl: ModalController) {}

  openBasicModal() {
    let myModal = this.modalCtrl.create(ModalPage);
    myModal.present();
  }
  openModalWithParams() {
    let myModal = this.modalCtrl.create(ModalPage, { 'myParam': this.myParam });
    myModal.present();
  }
}
