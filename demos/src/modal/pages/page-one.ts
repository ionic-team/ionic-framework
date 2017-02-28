import { Component } from '@angular/core';
import { ModalController } from '../../../../src';

import { ModalContentPage } from './modal-content';

@Component({
  templateUrl: 'page.html'
})
export class ModalFirstPage {
  myParam = '';

  constructor(public modalCtrl: ModalController) {}

  openBasicModal() {
    let myModal = this.modalCtrl.create(ModalContentPage);
    myModal.present();
  }
  openModalWithParams() {
    let myModal = this.modalCtrl.create(ModalContentPage, { 'myParam': this.myParam });
    myModal.present();
  }
}
