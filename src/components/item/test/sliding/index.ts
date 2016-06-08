import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, App, Alert, NavController, List, ItemSliding, Toast} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  @ViewChild('myList', {read: List}) list: List;

  items: number[] = [];
  shouldShow: boolean = true;

  moreText: string = "Dynamic More";
  archiveText: string = "Dynamic Archive";

  constructor(private app: App, private nav: NavController) {
    for (let x = 0; x < 5; x++) {
      this.items.push(x);
    }
  }

  changeDynamic() {
    if (this.moreText.includes("Dynamic")) {
      this.moreText = "Changed More";
      this.archiveText = "Changed Archive";
    } else {
      this.moreText = "Dynamic More";
      this.archiveText = "Dynamic Archive";
    }
  }

  closeOpened() {
    this.list.closeSlidingItems();
  }

  unread(item: ItemSliding) {
    if (item) {
      item.close();
    }
    console.log('UNREAD', item);
  }

  didClick(item: ItemSliding) {
    console.log('Clicked, ion-item');

    let alert = Alert.create({
      title: 'Clicked ion-item!',
      buttons: ['Ok']
    });
    this.nav.present(alert);
  }

  archive(item: ItemSliding) {
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

  del(item: ItemSliding) {
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

  download(item: ItemSliding) {
    item.setClass('downloading', true);
    setTimeout(() => {
      const toast = Toast.create({
        message: 'Item was downloaded!'
      });
      this.nav.present(toast);
      item.setClass('downloading', false);
      item.close();
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    }, 1500);
  }

  reload() {
    window.location.reload();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
