import {App, NavController, Page, IonicApp, Modal, ViewController} from '../../../../../ionic';


@Page({
  template: `
  <ion-toolbar>
    <ion-title>This is a modal</ion-title>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-buttons end>
      <button>
        <ion-icon name="funnel"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
  <ion-content padding>
    <p>The modal toolbar should have status bar padding.</p>
    <button block (click)="dismissModal()">Close modal</button>
  </ion-content>
  `
})
class MyModal {
  constructor(private viewCtrl: ViewController) {

  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}


@Page({
  templateUrl: 'page1.html'
})
class Page1 {
  page2 = Page2;
  sort: string = 'all';

  constructor(private nav: NavController) {}

  goToTabs() {
    this.nav.push(TabsPage);
  }
}


@Page({
  templateUrl: 'page2.html'
})
class Page2 {
  page3 = Page3;

  constructor(private nav: NavController) {

  }

  openModal() {
    let modal = Modal.create(MyModal);
    this.nav.present(modal);
  }
}


@Page({
  templateUrl: 'page3.html'
})
class Page3 {
  constructor(private nav: NavController) {

  }

  goBack() {
    this.nav.pop();
  }
}


@Page({
  template: `
  <ion-navbar *navbar>
    <ion-title>This is a tab page</ion-title>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-buttons end>
      <button>
        <ion-icon name="funnel"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
  <ion-content padding>
    <p>The toolbar should have status bar padding.</p>
  </ion-content>
  `
})
class TabPage1 {
  constructor(private nav: NavController) {

  }
}


@Page({
  templateUrl: 'tabs.html'
})
class TabsPage {
  tab1Root = TabPage1;
  tab2Root = Page2;
  tab3Root = Page3;

  constructor(private nav: NavController) {

  }

  goBack() {
    this.nav.pop();
  }
}


@App({
  templateUrl: `./app.html`,
  config: { statusbarPadding: true }
})
class E2EApp {
  root = Page1;
}
