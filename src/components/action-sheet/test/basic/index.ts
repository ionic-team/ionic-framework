import { Component } from '@angular/core';
import { ionicBootstrap, ActionSheetController, AlertController, ModalController, ViewController, Platform } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  result: string = '';

  constructor(private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private modalCtrl: ModalController, private platform: Platform) {}

  presentActionSheet1() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            this.result = 'Deleted';
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
            this.result = 'Shared';
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalPage);
            modal.present();

            // returning false does not allow the actionsheet to be closed
            return false;
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart' : null,
          handler: () => {
            console.log('Favorite clicked');
            this.result = 'Favorited';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
            this.result = 'Canceled';
          }
        }
      ]
    });

    actionSheet.present();
  }

  presentActionSheet2() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
            this.result = 'Archived';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel this clicked');
            this.result = 'Canceled';
          }
        },
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.result = 'Destructive';
          }
        }
      ]
    });

    actionSheet.present(actionSheet);
  }

  presentActionSheet3() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Open Alert',
          handler: () => {
            this.result = 'Opened alert';

            let alert = this.alertCtrl.create();
            alert.setTitle('Alert!');
            alert.setMessage('Alert opened from an action sheet');
            alert.addButton({
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.result = 'pressed Cancel button in alert from action sheet';
              }
            });
            alert.addButton({
              text: 'Okay',
              handler: () => {
                this.result = 'pressed Okay button in alert from action sheet';
              }
            });

            alert.present().then(() => {
              this.result = 'Alert from action sheet opened';
            });

            // do not close the action sheet yet
            return false;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.result = 'Canceled';
          }
        }
      ]
    });

    actionSheet.present();
  }

}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons start>
          <button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>Modal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Hi, I'm Bob, and I'm a modal.
    </ion-content>
  `
})
class ModalPage {
  constructor(private viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
