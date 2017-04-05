import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
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
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  goToPage2() {
    this.navCtrl.push('PageThree');
  }
}
