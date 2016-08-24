import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController, ModalController, ViewController } from '../../../..';
import { Injectable } from '@angular/core';


@Injectable()
export class SomeData {
  constructor() {}

  getData() {
    return 'SomeData';
  }
}

@Injectable()
export class OtherData {
  constructor() {}

  getData() {
    return 'OtherData';
  }
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>This is a modal</ion-title>
      <ion-buttons left>
        <button ion-button icon-only (click)="dismissModal()" class="e2eCordovaCloseModal">
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-buttons>
      <ion-buttons end>
        <button ion-button icon-only>
          <ion-icon name="funnel"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <p>The modal toolbar should have status bar padding.</p>
    <button ion-button block (click)="dismissModal()">Close modal</button>
  </ion-content>
  `
})
export class MyModal {
  constructor(public viewCtrl: ViewController) {}

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  page2 = Page2;
  sort: string = 'all';

  constructor(public navCtrl: NavController, public someData: SomeData, public otherData: OtherData) {
    console.log('Got some data from', someData.getData());
    console.log('Got some data from', otherData.getData());
  }

  goToTabs() {
    this.navCtrl.push(TabsPage);
  }
}


@Component({
  templateUrl: 'page2.html'
})
export class Page2 {
  page1 = Page1;
  page3 = Page3;

  constructor(public modalCtrl: ModalController) {}

  openModal() {
    this.modalCtrl.create(MyModal).present();
  }
}


@Component({
  templateUrl: 'page3.html'
})
export class Page3 {
  constructor(public navCtrl: NavController) {}

  goBack() {
    this.navCtrl.pop();
  }
}


@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>This is a tab page</ion-title>
      <button ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-buttons end>
        <button ion-button>
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
export class TabPage1 {}

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = TabPage1;
  tab2Root = Page2;
  tab3Root = Page3;

  constructor(public navCtrl: NavController) {}

  goBack() {
    this.navCtrl.pop();
  }
}


@Component({
  templateUrl: `./app.html`
})
export class E2EApp {
  root = Page1;
}


@NgModule({
  declarations: [
    E2EApp,
    TabsPage,
    TabPage1,
    Page1,
    Page2,
    Page3,
    MyModal
  ],
  imports: [
    IonicModule.forRoot(E2EApp, {
      statusbarPadding: true
    })
  ],
  providers: [SomeData, OtherData],
  bootstrap: [IonicApp],
  entryComponents: [
    TabsPage,
    TabPage1,
    Page1,
    Page2,
    Page3,
    MyModal
  ]
})
export class AppModule {}
