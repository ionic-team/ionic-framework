import { NgModule, Component, ViewChild } from '@angular/core';
import { App, AlertController, Content, DeepLinkConfig, IonicApp, IonicModule, NavController, NavParams, Tabs, Tab, ModalController, ViewController } from '../../../..';

@Component({
  selector: 'my-cmp2',
  template: `<span style="color:green">{{value}}</span>`
})
export class MyCmpTest2 {
  value: string = 'Test Failed';
}

@Component({
  selector: 'my-cmp',
  template: `<my-cmp2></my-cmp2> <span style="color:green">{{value}}</span>`
})
export class MyCmpTest {
  @ViewChild(MyCmpTest2) _label: MyCmpTest2;
  label: MyCmpTest2;
  value: string = 'Test Failed';

  ngOnInit() {
    this.label = this._label;
  }
}


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
        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>
        <button ion-item navPush="FullPage">Push FullPage w/ navPush="FullPage"</button>
        <button ion-item [navPush]="pushPage" [navParams]="{id:40}">Push w/ [navPush] and [navParams]</button>
        <button ion-item [navPush]="'FirstPage'">Push w/ [navPush] and string view name</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="pop()">Pop</button>
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
  pushPage = FullPage;
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
      { page: PrimaryHeaderPage }
    ];

    this.navCtrl.setPages(items);
  }

  setRoot() {
    this.navCtrl.setRoot(PrimaryHeaderPage);
  }

  pushPrimaryHeaderPage() {
    this.navCtrl.push(PrimaryHeaderPage, null, {
      animate: true,
      animation: 'ios-transition'
    }).then(() => { }, (rejectReason: string) => {
    });
  }

  pushRedirect() {
    this.navCtrl.push(RedirectPage).then(() => { }, (rejectReason: string) => {
    });
  }

  pushFullPage() {
    this.navCtrl.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] }, {
      animate: true,
      animation: 'md-transition'
    }).catch(() => {
    });
  }

  pushAnother() {
    this.navCtrl.push(AnotherPage, null, {
      animate: true,
      animation: 'wp-transition'
    }).catch(() => {
    });
  }

  pushTabsPage() {
    this.navCtrl.push(TabsPage).catch(() => {
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


@Component({template: '<ion-content></ion-content>'})
export class RedirectPage {
  constructor(public navCtrl: NavController) { }
  ionViewDidEnter() {
    this.navCtrl.push(PrimaryHeaderPage);
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

//
// Tab 1
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Heart</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>
          Tab 1
        </ion-list-header>
        <ion-item>
          <button ion-button (click)="goBack()">Back</button>
        </ion-item>
        <ion-item (click)="goTo()" *ngFor="let i of items">Item {{i}} {{i}} {{i}} {{i}}</ion-item>
      </ion-list>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab1 {
  items: any[] = [];

  constructor(private tabs: Tabs, private app: App, private nav: NavController) {
    for (var i = 1; i <= 250; i++) {
      this.items.push(i);
    }
  }

  goBack() {
    this.nav.parent.parent.pop();
  }

  goTo() {
    this.nav.push(TabItemPage);
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

//
// Tab 2
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Schedule</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item-sliding *ngFor="let session of sessions" #slidingItem>
          <ion-item>
            <h3>{{session.name}} {{session.name}} {{session.name}}</h3>
            <p>{{session.location}} {{session.location}} {{session.location}}</p>
          </ion-item>
          <ion-item-options>
            <button ion-button color="primary">Speaker<br>Info</button>
            <button ion-button color="secondary">Add to<br>Favorites</button>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
  `
})
export class Tab2 {
  sessions: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
    for (var i = 1; i <= 250; i++) {
      this.sessions.push({
        name: 'Name ' + i,
        location: 'Location: ' + i
      });
    }
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

//
// Tab 3
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Stopwatch</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h2>Tab 3</h2>
      <p>
        <button ion-button (click)="presentAlert()">Present Alert</button>
        <button ion-button (click)="presentModal()">Present Modal</button>
      </p>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab3 {
  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController, private tabs: Tabs, private app: App) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert Title!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentModal() {
    // this.modalCtrl.create(MyModal).present();
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}


@Component({
  template: `
    <ion-menu [content]="content">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <button ion-item menuClose detail-none>
            Close Menu
          </button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-tabs #content (ionChange)="onChange($event)">
      <ion-tab tabUrlPath="plain" tabTitle="Plain List" tabIcon="star" [root]="root1" (ionSelect)="onSelect($event)"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root2"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="logo-facebook" [root]="root3"></ion-tab>
      <ion-tab tabTitle="Messages" tabIcon="chatboxes" [root]="root1"></ion-tab>
      <ion-tab tabTitle="My Profile" tabIcon="person" [root]="root2"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root1 = Tab1;
  root2 = Tab2;
  root3 = Tab3;

  onChange(ev: Tab) {
    console.log('Changed tab', ev);
  }

  onSelect(ev: Tab) {
    console.log('Selected tab', ev);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Tab Item</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <h2>Hello moto</h2>
    </ion-content>
    `
})
export class TabItemPage {
  items: any[] = [];

  constructor(private tabs: Tabs, private app: App) {
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
    { component: Tabs, name: 'tabs' },
    { component: Tab1, name: 'tab1' },
    { component: TabItemPage, name: 'item' }
  ]
};

@NgModule({
  declarations: [
    E2EApp,
    FirstPage,
    RedirectPage,
    AnotherPage,
    MyCmpTest,
    MyCmpTest2,
    FullPage,
    PrimaryHeaderPage,
    TabsPage,
    Tab1,
    Tab2,
    Tab3,
    TabItemPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      swipeBackEnabled: true
    }, deepLinkConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    FirstPage,
    RedirectPage,
    AnotherPage,
    FullPage,
    PrimaryHeaderPage,
    TabsPage,
    Tab1,
    Tab2,
    Tab3,
    TabItemPage
  ]
})
export class AppModule {}
