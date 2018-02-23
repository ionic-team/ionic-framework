import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AlertController, NavController, ToastController } from '@ionic/angular';


@Component({
  selector: 'page-user',
  templateUrl: 'support.html',
  styleUrls: ['./support.scss']
})
export class SupportPage {

  submitted = false;
  supportMessage: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidEnter() {
    const toast = this.toastCtrl.create({
      message: 'This does not actually send a support request.',
      duration: 3000
    });
    toast.present();
  }

  submit(form: NgForm) {
    this.submitted = true;
    const toast = this.toastCtrl.create({
      message: 'Your support request has been sent.',
      duration: 3000
    });
    toast.onDidDismiss(() => {
      this.supportMessage = '';
      this.submitted = false;
    });
    return toast.present();
  }
}
