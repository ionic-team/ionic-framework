import { Component } from '@angular/core';
import { ModalController } from '../../../../../..';

import { ModalPage } from '../modal/modal-page';

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  page1 = 'page-one';
  page3 = 'page-three';

  constructor(public modalCtrl: ModalController) {}

  openModal() {
    const modal = this.modalCtrl.create(ModalPage);
    modal.present();
  }
}
