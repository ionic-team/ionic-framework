import {Component} from '@angular/core';
import {ionicBootstrap, NavController, Modal, ViewController} from '../../../../../src';
import {Injectable} from '@angular/core';


@Injectable()
export class SomeData {
  constructor() {}

  getData() {
    return "SomeData";
  }
}

@Injectable()
export class OtherData {
  constructor() {}

  getData() {
    return "OtherData";
  }
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>This is a modal</ion-title>
      <button menuToggle class="e2eCordovaOpenLeftMenu">
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-buttons end>
        <button>
          <ion-icon name="funnel"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <p>The modal toolbar should have status bar padding.</p>
    <button block (click)="dismissModal()">Close modal</button>
  </ion-content>
  `
})
class MyModal {
  constructor(private viewCtrl: ViewController) {}

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  page2 = Page2;
  sort: string = 'all';

  constructor(private nav: NavController, private someData: SomeData, private otherData: OtherData) {
    console.log("Got some data from", someData.getData());
    console.log("Got some data from", otherData.getData());
  }

  goToTabs() {
    this.nav.push(TabsPage);
  }
}


@Component({
  templateUrl: 'page2.html'
})
class Page2 {
  page1 = Page1;
  page3 = Page3;

  constructor(private nav: NavController) {}

  openModal() {
    let modal = Modal.create(MyModal);
    this.nav.present(modal);
  }
}


@Component({
  templateUrl: 'page3.html'
})
class Page3 {
  constructor(private nav: NavController) {}

  goBack() {
    this.nav.pop();
  }
}


@Component({
  template: `
  <ion-header>
    <ion-navbar>
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
  </ion-header>
  <ion-content padding>
    <p>The toolbar should have status bar padding.</p>
  </ion-content>
  `
})
class TabPage1 {
  constructor(private nav: NavController) {}
}


@Component({
  templateUrl: 'tabs.html'
})
class TabsPage {
  tab1Root = TabPage1;
  tab2Root = Page2;
  tab3Root = Page3;

  constructor(private nav: NavController) {}

  goBack() {
    this.nav.pop();
  }
}


@Component({
  templateUrl: `./app.html`
})
class E2EApp {
  root = Page1;
}

ionicBootstrap(E2EApp, [SomeData, OtherData], {
  statusbarPadding: true
});
