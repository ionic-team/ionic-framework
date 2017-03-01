import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, NavController, ViewController } from '../../../../../..';

import { MyCmpTest } from './my-component';

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{title}}</ion-title>
        <ion-buttons start>
          <button ion-button icon-only><ion-icon name="star"></ion-icon></button>
        </ion-buttons>
        <ion-buttons end>
          <button ion-button>S1g</button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <div padding>
        <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
        <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
        <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
        <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
        <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
        <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
        <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
        <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>
        <my-cmp></my-cmp>
      </div>
      <ion-list>
        <ion-list-header>
          {{title}}
        </ion-list-header>
        <ion-item class="e2eFrom1To2" (click)="pushFullPage()">Push to FullPage</ion-item>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushRedirect()">Push to Redirect</button>
        <button ion-item (click)="pushTabsPage()">Push to Tabs Page</button>
        <button ion-item (click)="pushAnother()">Push to AnotherPage</button>
        <button ion-item navPush="full-page">Push FullPage w/ navPush="full-page"</button>
        <button ion-item [navPush]="pushPage" [navParams]="{id:40}">Push w/ [navPush] and [navParams]</button>
        <button ion-item navPush="first-page">Push w/ navPush="first-page"</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="pop()">Pop</button>
        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label>Toggle Can Leave</ion-label>
          <ion-toggle (click)="canLeave = !canLeave"></ion-toggle>
        </ion-item>
        <button ion-item (click)="viewDismiss()">View Dismiss</button>
        <button ion-item (click)="quickPush()">New push during transition</button>
        <button ion-item (click)="quickPop()">New pop during transition</button>
        <button ion-item (click)="reload()">Reload</button>
        <button ion-item (click)="scrollToBottom()">Scroll to bottom</button>
        <button ion-item *ngFor="let i of pages" (click)="pushPrimaryHeaderPage()">Page {{i}}</button>
        <button ion-item (click)="content.scrollToTop()">Scroll to top</button>
      </ion-list>
    </ion-content>`
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
    if (this.canLeave) {
      return true;
    }

    let alert = this.alertCtrl.create();
    alert.setMessage('You can check-out any time you like, but you can never leave.');
    alert.addButton({ text: 'Umm, ok', role: 'cancel', });
    alert.present();

    this.called.ionViewCanLeave++;

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
    }).then(() => { }, (rejectReason: string) => {
    });
  }

  pushRedirect() {
    this.navCtrl.push('redirect-page').then(() => { }, (rejectReason: string) => {
    });
  }

  pushFullPage() {
    this.navCtrl.push('full-page', { id: 8675309, myData: [1, 2, 3, 4] }, {
      animate: true,
      animation: 'md-transition'
    }).catch(() => {
    });
  }

  pushAnother() {
    this.navCtrl.push('another-page', null, {
      animate: true,
      animation: 'wp-transition'
    }).catch(() => {
    });
  }

  pushTabsPage() {
    this.navCtrl.push('tabs').catch(() => {
    });
  }


  quickPush() {
    this.navCtrl.push('another-page').catch(() => {
    });
    setTimeout(() => {
      this.navCtrl.push('primary-header-page').catch(() => {
      });
    }, 150);
  }

  quickPop() {
    this.navCtrl.push('another-page').catch(() => {
    });
    setTimeout(() => {
      this.navCtrl.remove(1, 1).catch(() => {
      });
    }, 250);
  }

  pop() {
    this.navCtrl.pop().catch(() => {});
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
