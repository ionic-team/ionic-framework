import {App, Page, ActionSheet, NavController} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(nav: NavController) {
    this.nav = nav;
  }

  openActionSheet1(ev) {
    this.result = '';

    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('cancel this clicked');
            this.result = 'Canceled';
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
            this.result = 'Archived';
          }
        },
        {
          text: 'No close',
          handler: () => {
            console.log('do not close clicked');

            // returning false does not allow the actionsheet to be closed
            return false;
          }
        },
        {
          text: 'Destructive',
          style: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.result = 'Destructive';
          }
        }
      ]
    });

    this.nav.present(actionSheet);
  }

  openActionSheet2(ev) {
    this.result = '';

    let actionSheet = ActionSheet.create({
      buttons: [
        {
          text: 'Destructive',
          style: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.result = 'Destructive';
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
            this.result = 'Archived';
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          handler: () => {
            console.log('cancel this clicked');
            this.result = 'Canceled';
          }
        }
      ]
    });

    this.nav.present(actionSheet);
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
