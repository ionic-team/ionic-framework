import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, AlertController, NavController, List, ItemSliding, ToastController } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  @ViewChild('myList', {read: List}) list: List;

  items: number[] = [];
  slidingEnabled: boolean = true;

  moreText: string = 'Dynamic More';
  archiveText: string = 'Dynamic Archive';

  constructor(private nav: NavController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
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

    } else {
      this.moreText = 'Dynamic More';
      this.archiveText = 'Dynamic Archive';
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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
