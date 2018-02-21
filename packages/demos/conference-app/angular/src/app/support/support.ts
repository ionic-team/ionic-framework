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

    if (form.valid) {
      this.supportMessage = '';
      this.submitted = false;

      const toast = this.toastCtrl.create({
        message: 'Your support request has been sent.',
        duration: 3000
      });
      toast.present();
    }
  }

  // If the user enters text in the support question and then navigates
  // without submitting first, ask if they meant to leave the page
  ionViewCanLeave(): boolean | Promise<boolean> {
    // If the support message is empty we should just navigate
    if (!this.supportMessage || this.supportMessage.trim().length === 0) {
      return true;
    }

    return new Promise((resolve: any, reject: any) => {
      const alert = this.alertCtrl.create({
        title: 'Leave this page?',
        message: 'Are you sure you want to leave this page? Your support message will not be submitted.',
        buttons: [
          { text: 'Stay', handler: reject },
          { text: 'Leave', role: 'cancel', handler: resolve }
        ]
      });

      alert.present();
    });
  }
}
