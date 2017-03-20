import { Component } from '@angular/core';
import { AlertController, IonicPage, ViewController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'toolbar.html'
})
export class ToolbarModal {

  constructor(public viewCtrl: ViewController, public alertCtrl: AlertController) {}

  ionViewDidEnter() {
    let alert = this.alertCtrl.create({
        title: 'Test',
        buttons: [
            {
                text: 'Something',
                role: 'cancel'
            }
        ]
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
