import { Component, ViewChild } from '@angular/core';
import { AlertController, ItemSliding, List, ToastController } from '../../../../../../';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  @ViewChild('myList', {read: List}) list: List;

  items: number[] = [];
  slidingEnabled: boolean = true;

  moreText: string = 'Dynamic More';
  archiveText: string = 'Dynamic Archive';

  showOptions: boolean = false;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) {
    for (let x = 0; x < 5; x++) {
      this.items.push(x);
    }
  }

  toggleSliding() {
    this.slidingEnabled = !this.slidingEnabled;
  }

  changeDynamic() {
    if (this.moreText.includes('Dynamic')) {
      this.moreText = 'Changed More';
      this.archiveText = 'Changed Archive';
      this.showOptions = true;
    } else {
      this.moreText = 'Dynamic More';
      this.archiveText = 'Dynamic Archive';
      this.showOptions = false;
    }
  }

  closeOpened() {
    this.list.closeSlidingItems();
  }

  noclose(item: ItemSliding) {
    console.log('no close', item);
  }

  unread(item: ItemSliding) {
    if (item) {
      item.close();
    }
    console.log('UNREAD', item);
  }

  didClick(_: ItemSliding) {
    console.log('Clicked, ion-item');

    let alert = this.alertCtrl.create({
      title: 'Clicked ion-item!',
      buttons: ['Ok']
    });
    alert.present();
  }

  archive(item: ItemSliding) {
    console.log('Archive, ion-item-options button', item);

    let alert = this.alertCtrl.create({
      title: 'Archived!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          item.close();
        }
      }]
    });
    alert.present();
  }

  del(item: ItemSliding) {
    console.log('Delete ion-item-options button', item);

    let alert = this.alertCtrl.create({
      title: 'Deleted!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          item.close();
        }
      }]
    });
    alert.present();
  }

  download(item: ItemSliding) {
    item.setElementClass('downloading', true);
    setTimeout(() => {
      const toast = this.toastCtrl.create({
        message: 'Item was downloaded!'
      });
      toast.present();

      item.setElementClass('downloading', false);
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
