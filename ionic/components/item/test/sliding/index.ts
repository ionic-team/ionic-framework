import {App, Page, IonicApp, Alert, NavController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private app: IonicApp, private nav: NavController) {
    this.items = [];
    for (let x = 0; x < 20; x++) {
      this.items.push(x);
    }

    this.shouldShow = true;
  }

  closeOpened() {
    this.app.getComponent('myList').closeSlidingItems();
  }

  didClick(item) {
    console.log('Clicked, ion-item');

    let alert = Alert.create({
      title: 'Clicked ion-item!',
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }

  archive(item) {
    console.log('Archive, ion-item-options button', item);

    let alert = Alert.create({
      title: 'Archived!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          item.close();
        }
      }]
    });
    this.nav.present(alert);
  }

  del(item) {
    console.log('Delete ion-item-options button', item);

    let alert = Alert.create({
      title: 'Deleted!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          item.close();
        }
      }]
    });
    this.nav.present(alert);
  }

  reload() {
    window.location.reload();
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
