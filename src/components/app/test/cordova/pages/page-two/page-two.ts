import { Component } from '@angular/core';
import { DeepLink, ModalController } from '../../../../../..';

@DeepLink({
  name: 'page-two'
})
@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  page1 = 'page-one';
  page3 = 'page-three';

  constructor(public modalCtrl: ModalController) {}

  openModal() {
    const modal = this.modalCtrl.create('modal-page');
    modal.present();
  }
}
