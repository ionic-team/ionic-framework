import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, ActionSheetController, AlertController, ModalController, ViewController, Platform } from '../../../..';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  result: string = '';

  constructor(public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public modalCtrl: ModalController, public platform: Platform) {}

  presentActionSheet1() {
    this.result = '';

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.result = 'Deleted';
          }
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
            this.result = 'Shared';
          }
        },
        {
          text: 'Play',
          icon: 'arrow-dropright-circle',
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
      ],
      cssClass: 'my-action-sheet another-action-sheet-class'
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
          <button ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>Modal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Hi, I'm Bob, and I'm a modal.
    </ion-content>
  `
})
export class ModalPage {

  constructor(public viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}


@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    ModalPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage,
    ModalPage
  ]
})
export class AppModule {}
