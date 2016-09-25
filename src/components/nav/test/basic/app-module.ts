import { NgModule, Component, ViewChild } from '@angular/core';
import { App, AlertController, Content, DeepLinkConfig, IonicApp, IonicModule, NavController, NavParams, ViewController } from '../../../..';

@Component({
  selector: 'my-cmp',
  template: `<p>My Custom Component Test <ion-icon name="star"></ion-icon></p>`
})
export class MyCmpTest {}


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
      <ion-list>
        <ion-list-header>
          {{title}}
        </ion-list-header>
        <button ion-item class="e2eFrom1To2" (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushAnother()">Push to AnotherPage</button>
        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>
        <button ion-item navPush="FullPage">Push FullPage w/ navPush="FullPage"</button>
        <button ion-item [navPush]="pushPage" [navParams]="{id:40}">Push w/ [navPush] and [navParams]</button>
        <button ion-item [navPush]="'FirstPage'">Push w/ [navPush] and string view name</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="navCtrl.pop()">Pop</button>
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
      <my-cmp></my-cmp>
    </ion-content>`
})
export class FirstPage {
  pushPage = FullPage;
  title = 'First Page';
  pages: Array<number> = [];
  @ViewChild(Content) content: Content;
  canLeave = true;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad, FirstPage');
    for (var i = 1; i <= 50; i++) {
      this.pages.push(i);
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter, FirstPage', this.viewCtrl.id);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter, FirstPage', this.viewCtrl.id);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave, FirstPage', this.viewCtrl.id);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave, FirstPage', this.viewCtrl.id);
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload, FirstPage', this.viewCtrl.id);
  }

  ionViewCanLeave() {
    if (this.canLeave) {
      return true;
    }

    let alert = this.alertCtrl.create();
    alert.setMessage('You can check-out any time you like, but you can never leave.');
    alert.addButton({ text: 'Umm, ok', role: 'cancel', });
    alert.present();

    return false;
  }

  setPages() {
    let items = [
      { page: PrimaryHeaderPage }
    ];

    this.navCtrl.setPages(items);
  }

  setRoot() {
    this.navCtrl.setRoot(PrimaryHeaderPage);
  }

  pushPrimaryHeaderPage() {
    this.navCtrl.push(PrimaryHeaderPage).then(() => {}, (rejectReason: string) => {
    });
  }

  pushFullPage() {
    this.navCtrl.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] }).catch(() => {
    });
  }

  pushAnother() {
    this.navCtrl.push(AnotherPage).catch(() => {
    });
  }

  quickPush() {
    this.navCtrl.push(AnotherPage).catch(() => {
    });
    setTimeout(() => {
      this.navCtrl.push(PrimaryHeaderPage).catch(() => {
      });
    }, 150);
  }

  quickPop() {
    this.navCtrl.push(AnotherPage).catch(() => {
    });
    setTimeout(() => {
      this.navCtrl.remove(1, 1).catch(() => {
      });
    }, 250);
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


@Component({
  template: `
    <ion-content padding>
      <h1>Full page</h1>
      <p>This page does not have a nav bar!</p>
      <p><button ion-button (click)="navCtrl.pop()">Pop</button></p>
      <p><button ion-button class="e2eFrom2To3" (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button></p>
      <p><button ion-button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button ion-button (click)="pushFirstPage()">Push to FirstPage</button></p>
      <p><button ion-button class="e2eFrom2To1" navPop>Pop with NavPop (Go back to 1st)</button></p>
      <p><button ion-button (click)="setPages()">setPages() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>
      <p><button ion-button (click)="presentAlert()">Present Alert</button></p>
    </ion-content>
  `
})
export class FullPage {
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public app: App,
    public alertCtrl: AlertController,
    public params: NavParams
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad, FullPage', this.viewCtrl.id);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter, FullPage', this.viewCtrl.id);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter, FullPage', this.viewCtrl.id);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave, FullPage', this.viewCtrl.id);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave, FullPage', this.viewCtrl.id);
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload, FullPage', this.viewCtrl.id);
  }

  setPages() {
    let items = [
      { page: FirstPage },
      { page: PrimaryHeaderPage }
    ];

    this.navCtrl.setPages(items);
  }

  pushPrimaryHeaderPage() {
    this.navCtrl.push(PrimaryHeaderPage);
  }

  pushAnother() {
    this.navCtrl.push(AnotherPage);
  }

  pushFirstPage() {
    this.navCtrl.push(FirstPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hello Alert');
    alert.setMessage('Dismiss this alert, then pop one page');
    alert.addButton({
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        // overlays are added and removed from the app root's portal
        // in the example below, alert.dismiss() dismisses the alert
        // from the app root portal, and once it's done transitioning out,
        // this the active page is popped from the nav
        alert.dismiss().then(() => {
          this.navCtrl.pop();
        });

        // by default an alert will dismiss itself
        // however, we don't want to use the default
        // but rather fire off our own pop navigation
        // return false so it doesn't pop automatically
        return false;
      }
    });
    alert.present();
  }

}


@Component({
  template: `
    <ion-header>
      <ion-navbar color="primary">
        <ion-title>Primary Color Page Header</ion-title>
        <ion-buttons end>
          <button ion-button>S1g</button>
        </ion-buttons>
      </ion-navbar>
      <ion-toolbar no-border-top>
        <ion-title>{{subheader}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding fullscreen>
      <p><button ion-button class="e2eFrom3To2" (click)="navCtrl.pop()">Pop</button></p>
      <p><button ion-button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button ion-button (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button ion-button (click)="setRoot()">setRoot(AnotherPage)</button></p>
      <p><button ion-button (click)="navCtrl.popToRoot()">Pop to root</button></p>
      <p><button ion-button id="insert" (click)="insert()">Insert first page into history before this</button></p>
      <p><button ion-button id="remove" (click)="removeSecond()">Remove second page in history</button></p>
      <div class="yellow"><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div></div>

      <button ion-button ion-fixed (click)="presentAlert()">fixed button (alert)</button>
      <div ion-fixed style="position: absolute; pointer-events: none; top:10px; bottom:10px; right:10px; width:50%; background: rgba(0,0,0,0.5);"></div>
    </ion-content>
    <ion-footer>
      <ion-toolbar no-border-bottom>
        I'm a sub footer!
      </ion-toolbar>
      <ion-toolbar no-border-top>
        <ion-title>Footer</ion-title>
      </ion-toolbar>
    </ion-footer>
  `
})
export class PrimaryHeaderPage {
  subheader: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad, PrimaryHeaderPage', this.viewCtrl.id);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter, PrimaryHeaderPage', this.viewCtrl.id);
    this.viewCtrl.setBackButtonText('Previous');
    this.subheader = 'I\'m a sub header!';
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter, PrimaryHeaderPage', this.viewCtrl.id);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave, PrimaryHeaderPage', this.viewCtrl.id);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave, PrimaryHeaderPage', this.viewCtrl.id);
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload, PrimaryHeaderPage', this.viewCtrl.id);
  }

  pushAnother() {
    this.navCtrl.push(AnotherPage);
  }

  pushFullPage() {
    this.navCtrl.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
  }

  insert() {
    this.navCtrl.insert(2, FirstPage);
  }

  removeSecond() {
    this.navCtrl.remove(1);
  }

  setRoot() {
    this.navCtrl.setRoot(AnotherPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hello Alert');
    alert.addButton({ text: 'Dismiss', role: 'cancel', });
    alert.present();
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar hideBackButton>
        <ion-title>Another Page Header</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-toolbar no-border-top>
        I'm a sub header in the content!
      </ion-toolbar>
      <ion-list>
        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>
        <ion-item>Back button hidden w/ <code>ion-navbar hideBackButton</code></ion-item>
        <button ion-item (click)="navCtrl.pop()">Pop</button>
        <button ion-item (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushFirstPage()">Push to FirstPage</button>
        <button ion-item (click)="setRoot()">setRoot(FirstPage)</button>
        <button ion-item (click)="toggleBackButton()">Toggle hideBackButton</button>
        <button ion-item (click)="setBackButtonText()">Set Back Button Text</button>
        <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      </ion-list>
      <ion-toolbar no-border-bottom>
        I'm a sub footer in the content!
      </ion-toolbar>
      <ion-toolbar no-border-bottom no-border-top>
        And I'm a sub footer in the content too!
      </ion-toolbar>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        Another Page Footer
      </ion-toolbar>
    </ion-footer>
  `
})
export class AnotherPage {
  bbHideToggleVal = false;
  bbCount = 0;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad, AnotherPage', this.viewCtrl.id);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter, AnotherPage', this.viewCtrl.id);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter, AnotherPage', this.viewCtrl.id);
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave, AnotherPage', this.viewCtrl.id);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave, AnotherPage', this.viewCtrl.id);
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload, AnotherPage', this.viewCtrl.id);
  }

  pushFullPage() {
    this.navCtrl.push(FullPage);
  }

  pushPrimaryHeaderPage() {
    this.navCtrl.push(PrimaryHeaderPage);
  }

  pushFirstPage() {
    this.navCtrl.push(FirstPage);
  }

  setRoot() {
    this.navCtrl.setRoot(FirstPage);
  }

  toggleBackButton() {
    this.bbHideToggleVal = !this.bbHideToggleVal;
    this.viewCtrl.showBackButton(this.bbHideToggleVal);
  }

  setBackButtonText() {
    let backButtonText = 'Messages';

    if (this.bbCount > 0) {
      backButtonText += ` (${this.bbCount})`;
    }

    this.viewCtrl.setBackButtonText(backButtonText);
    ++this.bbCount;
  }

}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = FirstPage;
}


export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: FirstPage, name: 'first-page' },
    { component: AnotherPage, name: 'another-page' },
    { component: MyCmpTest, name: 'tab1-page1' },
    { component: FullPage, name: 'full-page', defaultHistory: ['first-page', 'another-page'] },
    { component: PrimaryHeaderPage, name: 'primary-header-page', defaultHistory: ['first-page', 'full-page'] },
  ]
};

@NgModule({
  declarations: [
    E2EApp,
    FirstPage,
    AnotherPage,
    MyCmpTest,
    FullPage,
    PrimaryHeaderPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp, null, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    FirstPage,
    AnotherPage,
    FullPage,
    PrimaryHeaderPage
  ]
})
export class AppModule {}
