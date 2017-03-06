import { Component } from '@angular/core';
import { NavController, App, ActionSheetController, ToastController, AlertController, ModalController } from '../../../../../..';

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>First Page Header</ion-title>
        <ion-buttons start>
          <button ion-button class="e2eCloseMenu" (click)="dismiss()" strong>Close</button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
      <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
      <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
      <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
      <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
      <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
      <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
      <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>
      <p>
        <button ion-button (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button ion-button (click)="openActionSheet()">Open Action Sheet</button>
      </p>
      <p>
        <button ion-button (click)="openModal()">Open same modal</button>
      </p>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <ion-list>
        <ion-item *ngFor="let item of items">
          Item Number: {{item.value}}
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class ModalFirstPage {
  items: any[] = [];
  called: any;

  constructor(
    public navCtrl: NavController,
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) {
    for (let i = 0; i < 50; i++) {
      this.items.push({
        value: (i + 1)
      });
    }

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

  push() {
    this.toastCtrl.create({
      message: 'Will push a page in a moment...',
      duration: 1000,
    }).present();

    setTimeout(() => {
      this.navCtrl.push('ModalSecondPage', {
        id: 8675309,
        myData: [1, 2, 3, 4]
      });
    }, 500);
  }

  dismiss() {
    this.navCtrl.parent.pop();
  }

  ionViewCanEnter() {
    console.log('ModalFirstPage ionViewCanEnter fired');
    this.called.ionViewCanEnter++;
    return true;
  }

  ionViewCanLeave() {
    console.log('ModalFirstPage ionViewCanLeave fired');
    this.called.ionViewCanLeave++;
    return true;
  }

  ionViewWillLoad() {
    console.log('ModalFirstPage ionViewWillLoad fired');
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    console.log('ModalFirstPage ionViewDidLoad fired');
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    console.log('ModalFirstPage ionViewWillEnter fired');
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    console.log('ModalFirstPage ionViewDidEnter fired');
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
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    console.log('ModalFirstPage ionViewWillLeave fired');
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    console.log('ModalFirstPage ionViewDidLeave fired');
    this.called.ionViewDidLeave++;
  }

  openModal() {
    this.modalCtrl.create('ContactUs').present();
  }

  openActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Go To Root',
          handler: () => {
            actionSheet.dismiss().then(() => {
              this.navCtrl.parent.pop();
            });

            // by default an alert will dismiss itself
            // however, we don't want to use the default
            // but rather fire off our own pop navigation
            // return false so it doesn't pop automatically
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel this clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
}
