import { Component, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {

  changes = 0;

  constructor(
    private alertCtrl: AlertController
  ) { }

  counter() {
    this.changes++;
    return Math.floor(this.changes / 2);
  }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Hello',
      message: 'Some text',
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel',
          handler: () => {
            console.log(NgZone.isInAngularZone());
            NgZone.assertInAngularZone();
          }
        }
      ]
    });
    await alert.present();
  }
}
