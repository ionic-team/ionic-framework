import {ViewChild} from '@angular/core';
import {App, Page, IonicApp, Alert, NavController, List, ItemSliding} from '../../../../../src';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  @ViewChild('myList', {read: List}) list: List;

  items = [];
  shouldShow: boolean = true;

  constructor(private app: IonicApp, private nav: NavController) {
    for (let x = 0; x < 20; x++) {
      this.items.push(x);
    }
  }

  closeOpened() {
    this.list.closeSlidingItems();
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
  root = E2EPage;

  constructor() {

  }
}
