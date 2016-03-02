import {App, Page, ActionSheet, Modal, NavController, ViewController, Platform} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  result: string = '';

  constructor(private nav: NavController, private platform: Platform) {}

  presentActionSheet1() {
    this.result = '';

    let actionSheet = ActionSheet.create({
      title: 'Albums',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: this.platform.is('android') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            this.result = 'Deleted';
          }
        },
        {
          text: 'Share',
          icon: this.platform.is('android') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
            this.result = 'Shared';
          }
        },
        {
          text: 'Play',
          icon: this.platform.is('android') ? 'arrow-dropright-circle' : null,
          handler: () => {
            let modal = Modal.create(ModalPage);
            this.nav.present(modal);

            // returning false does not allow the actionsheet to be closed
            return false;
          }
        },
        {
          text: 'Favorite',
          icon: this.platform.is('android') ? 'heart' : null,
          handler: () => {
            console.log('Favorite clicked');
            this.result = 'Favorited';
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: this.platform.is('android') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
            this.result = 'Canceled';
          }
        }
      ]
    });

    this.nav.present(actionSheet);
  }

  presentActionSheet2(ev) {
    this.result = '';

    let actionSheet = ActionSheet.create({
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

    this.nav.present(actionSheet);
  }

}

@Page({
  template: `
    <ion-toolbar>
      <ion-buttons start>
        <button (click)="dismiss()">Close</button>
      </ion-buttons>
      <ion-title>Modal</ion-title>
    </ion-toolbar>
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


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = E2EPage;
  }
}
