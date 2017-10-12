import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, IonicPage, NavController, ViewController } from '../../../../../..';

import { MyCmpTest } from './my-component';

@IonicPage({
  name: 'first-page'
})
@Component({
  templateUrl: 'first-page.html'
})
export class FirstPage {

  pushPage = 'another-page';
  firstPage = FirstPage;

  title = 'First Page';
  pages: Array<number> = [];

  @ViewChild(Content) content: Content;
  @ViewChild(MyCmpTest) myCmp: MyCmpTest;

  canLeave = true;
  called: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
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

  ionViewWillLoad() {
    console.log('ionViewWillLoad, FirstPage', this.viewCtrl.id);
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad, FirstPage');
    for (var i = 1; i <= 50; i++) {
      this.pages.push(i);
    }
    if (!this.myCmp || !this.content || !this.myCmp.label) {
      throw new Error('children are not loaded');
    }
    this.myCmp.value = '👍 self test passed!';
    this.myCmp.label.value = '👍 children test passed!';
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter, FirstPage', this.viewCtrl.id);
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter, FirstPage', this.viewCtrl.id);
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave, FirstPage', this.viewCtrl.id);
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave, FirstPage', this.viewCtrl.id);
    this.called.ionViewDidLeave++;
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload, FirstPage', this.viewCtrl.id);
    this.called.ionViewWillUnload++;
  }

  ionViewCanLeave() {
    this.called.ionViewCanLeave++;
    if (this.canLeave) {
      return true;
    }

    let alert = this.alertCtrl.create();
    alert.setMessage('You can check-out any time you like, but you can never leave.');
    alert.addButton({ text: 'Umm, ok', role: 'cancel', });
    alert.present();

    return false;
  }

  ionViewCanEnter() {
    this.called.ionViewCanEnter++;
    return true;
  }

  setPages() {
    let items = [
      { page: 'primary-header-page' }
    ];

    this.navCtrl.setPages(items);
  }

  setRoot() {
    this.navCtrl.setRoot('primary-header-page');
  }

  pushPrimaryHeaderPage() {
    this.navCtrl.push('primary-header-page', null, {
      animate: true,
      animation: 'ios-transition'
    }).then(() => { }, () => { });
  }

  pushRedirect() {
    this.navCtrl.push('redirect-page').then(() => { }, () => { });
  }

  pushFullPage() {
    this.navCtrl.push('full-page', { id: 8675309, myData: [1, 2, 3, 4] }, {
      animate: true,
      animation: 'md-transition'
    });
  }

  pushAnother() {
    this.navCtrl.push('another-page', null, {
      animate: true,
      animation: 'wp-transition'
    });
  }

  pushTabsPage() {
    this.navCtrl.push('tabs');
  }


  quickPush() {
    this.navCtrl.push('another-page');
    setTimeout(() => {
      this.navCtrl.push('primary-header-page');
    }, 150);
  }

  quickPop() {
    this.navCtrl.push('another-page');
    setTimeout(() => {
      this.navCtrl.remove(1, 1);
    }, 250);
  }

  pop() {
    this.navCtrl.pop();
  }

  viewDismiss() {
    this.viewCtrl.dismiss();
  }

  reload() {
    window.location.reload();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  scrollToBottom() {
    this.content.scrollToBottom(1000);
  }
}
