import { Injectable, Component } from '@angular/core';
import { ViewController, ToastController, AlertController, NavParams, Config } from '../../../../../..';

import { SomeAppProvider } from '../../components/some-app-provider';

@Injectable()
export class SomeComponentProvider {
  constructor(public config: Config) {
    console.log('SomeComponentProvider constructor');
  }

  getName() {
    return 'Jenny';
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Data in/out</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>UserId</ion-label>
          <ion-input type="number" [(ngModel)]="data.userId"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Name</ion-label>
          <ion-input [(ngModel)]="data.name"></ion-input>
        </ion-item>
      </ion-list>
      <button ion-button full (click)="submit()">Submit</button>
      <div padding>
        <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
        <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
        <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
        <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
        <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
        <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
        <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
        <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>
      </div>
    </ion-content>
  `,
  providers: [SomeComponentProvider]
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
