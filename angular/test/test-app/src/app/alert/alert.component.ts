import { Component, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {

  constructor(
    private alertCtrl: AlertController
  ) { }

  async openAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Hello',
      message: 'Some text'
    });
    await alert.present();
  }
}
