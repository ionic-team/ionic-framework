import { Component } from '@angular/core';
import { LoadingController, NavController } from '../../../../../..';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController) {}

  presentLoading() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading...',
      duration: 1000
    });

    loading.present();
  }

  presentLoadingNav() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    loading.present();

    setTimeout(() => {
      this.navCtrl.push('Page2');

      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    }, 1000);
  }

}
