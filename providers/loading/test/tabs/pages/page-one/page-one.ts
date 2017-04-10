import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
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
      this.navCtrl.push('PageTwo');

      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    }, 1000);
  }

}
