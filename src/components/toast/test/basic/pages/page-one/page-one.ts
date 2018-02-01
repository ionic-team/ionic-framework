import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) { }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'User was created successfully'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

    setTimeout(() => {
      this.navCtrl.push('PageTwo');
    }, 1000);

    setTimeout(() => {
      toast.dismiss();
    }, 2000);
  }

  showLongToast() {
    const toast = this.toastCtrl.create()
      .setMessage('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.')
      .setDuration(5000)
      .setCssClass('custom-class my-toast');

    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  showDismissDurationToast() {
    const toast = this.toastCtrl.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  showToastWithCloseButton(positionString: string) {
    const toast = this.toastCtrl.create({
      message: 'Your internet connection appears to be offline. Data integrity is not gauranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: positionString
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  showDismissPageChangeToast() {
    const toast = this.toastCtrl.create({
      message: 'I am dismissed on page change',
      dismissOnPageChange: true
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();

    setTimeout(() => {
      this.navCtrl.push('PageTwo');
    }, 1000);
  }

  private dismissHandler() {
    console.info('Toast onDidDismiss()');
  }

}
