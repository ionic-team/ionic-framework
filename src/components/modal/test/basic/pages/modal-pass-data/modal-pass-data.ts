import { Component } from '@angular/core';
import { AlertController, DeepLink, NavParams, ToastController, ViewController } from '../../../../../..';

import { SomeAppProvider } from '../../services/some-app-provider';
import { SomeComponentProvider } from './provider';

@DeepLink()
@Component({
  templateUrl: 'modal-pass-data.html',
  providers: [
    SomeComponentProvider
  ]
})
export class ModalPassData {
  data: any;
  called: any;

  constructor(
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    params: NavParams,
    someComponentProvider: SomeComponentProvider,
    someAppProvider: SomeAppProvider) {
    this.data = {
      userId: params.get('userId'),
      name: someComponentProvider.getName()
    };
    console.log('SomeAppProvider Data', someAppProvider.getData());

    this.called = {
      ionViewCanEnter: 0,
      ionViewCanLeave: 0,
      ionViewWillLoad: 0,
      ionViewDidLoad: 0,
      ionViewWillEnter: 0,
      ionViewDidEnter: 0,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0
    };
  }

  submit() {
    console.time('modal');
    this.viewCtrl.dismiss(this.data).catch(() => {
      console.log('submit was cancelled');
    });
  }

  ionViewCanEnter() {
    console.log('ModalPassData ionViewCanEnter fired');
    this.called.ionViewCanEnter++;

    return true;
  }

  ionViewCanLeave() {
    console.log('ModalPassData ionViewCanLeave fired');
    this.called.ionViewCanLeave++;

    return new Promise((resolve: any, reject: any) => {
      let alert = this.alertCtrl.create();
      alert.setTitle('Do you want to submit?');
      alert.addButton({ text: 'Submit', handler: resolve });
      alert.addButton({ text: 'Cancel', role: 'cancel', handler: reject });
      alert.present();
    });
  }

  ionViewWillLoad() {
    console.log('ModalPassData ionViewWillLoad fired');
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    console.log('ModalPassData ionViewDidLoad fired');
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    console.log('ModalPassData ionViewWillEnter fired');
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    console.log('ModalPassData ionViewDidEnter fired');
    this.toastCtrl.create({
      message: 'test toast',
      duration: 1000
    }).present();
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    console.log('ModalPassData ionViewWillLeave fired');
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    console.log('ModalPassData ionViewDidLeave fired');
    this.called.ionViewDidLeave++;
  }
}
