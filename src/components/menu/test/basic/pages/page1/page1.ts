import { Component } from '@angular/core';
import { AlertController, ModalController, NavController } from '../../../../../..';

import { Modal } from '../modal/modal';

@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) { }

  myMenu: string = 'right';

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      message: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      cssClass: 'my-alert',
      buttons: ['Ok']
    });
    alert.present();
  }

  presentModal() {
    let modal = this.modalCtrl.create(Modal);
    modal.present();
  }

  goToPage2() {
    this.navCtrl.push('Page2');
  }
}
