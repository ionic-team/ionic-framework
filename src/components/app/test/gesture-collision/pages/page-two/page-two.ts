import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, Refresher } from '../../../../../..';

@IonicPage({
  name: 'page-two'
})
@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      message: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      cssClass: 'my-alert',
      buttons: ['Ok']
    });
    alert.present();
  }

  goToPageTwo() {
    this.navCtrl.push('page-two');
  }

  doRefresh(refresher: Refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
