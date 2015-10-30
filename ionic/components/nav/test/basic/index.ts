import {App, NavController} from 'ionic/ionic';
import {Page, Config, IonicApp} from 'ionic/ionic';
import {NavParams, NavController, ViewController} from 'ionic/ionic';


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>{{title}}</ion-title>
      <ion-nav-items primary>
        <button><icon star></icon></button>
      </ion-nav-items>
      <ion-nav-items secondary>
        <button>S1</button>
      </ion-nav-items>
    </ion-navbar>
    <ion-content padding>
      <p>{{title}}</p>
      <p><button class="e2eFrom1To2" (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button [nav-push]="[pushPage, {id: 42}]">Push FullPage w/ [nav-push] array</button></p>
      <p><button [nav-push]="pushPage" [nav-params]="{id:40}">Push w/ [nav-push] and [nav-params]</button></p>
      <p><button [nav-push]="[\'FirstPage\', {id: 22}]">Push w/ [nav-push] array and string view name</button></p>
      <p><button nav-push="FirstPage" [nav-params]="{id: 23}">Push w/ nav-push and [nav-params]</button></p>
      <p><button (click)="setViews()">setViews() (Go to PrimaryHeaderPage)</button></p>
      <p><button (click)="nav.pop()">Pop</button></p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>`
})
class FirstPage {
  constructor(
    nav: NavController,
    app: IonicApp,
    config: Config
  ) {
    this.nav = nav;
    this.title = 'First Page';

    this.pushPage = FullPage;
  }

  setViews() {
    let items = [
      PrimaryHeaderPage
    ];

    this.nav.setViews(items);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1,2,3,4] } );
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }
}


@Page({
  template: `
    <ion-content padding>
      <h1>Full page</h1>
      <p>This page does not have a nav bar!</p>
      <p><button (click)="nav.pop()">Pop</button></p>
      <p><button class="e2eFrom2To3" (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button (click)="pushFirstPage()">Push to FirstPage</button></p>
      <p><button class="e2eFrom2To1" nav-pop>Pop with NavPop (Go back to 1st)</button></p>
      <p><button (click)="setViews()">setViews() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>
    </ion-content>
  `
})
class FullPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;
  }

  setViews() {
    let items = [
      FirstPage,
      PrimaryHeaderPage
    ];

    this.nav.setViews(items);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFirstPage() {
    this.nav.push(FirstPage);
  }

}


@Page({
  template: `
    <ion-navbar *navbar primary>
      <ion-title>Primary Color Page Header</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p><button class="e2eFrom3To2" (click)="nav.pop()">Pop</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button id="insert" (click)="insert()">Insert first page into history before this</button></p>
      <p><button id="remove" (click)="removeSecond()">Remove second page in history</button></p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
class PrimaryHeaderPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1,2,3,4] } );
  }

  insert() {
    this.nav.insert(FirstPage, 2);
  }

  removeSecond() {
    this.nav.remove(1);
  }

}


@Page({
  template: `
    <ion-navbar *navbar hide-back-button>
      <ion-title>Another Page Header</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p>Back button hidden w/ <code>ion-navbar hide-back-button</code></p>
      <p><button (click)="nav.pop()">Pop</button></p>
      <p><button (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button></p>
      <p><button (click)="pushFirstPage()">Push to FirstPage</button></p>
      <p><button (click)="toggleBackButton()">Toggle hide-back-button</button></p>
    </ion-content>
  `
})
class AnotherPage {
  constructor(
    nav: NavController,
    viewCtrl: ViewController
  ) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.bbHideToggleVal = true;
  }

  pushFullPage() {
    this.nav.push(FullPage);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushFirstPage() {
    this.nav.push(FirstPage);
  }

  toggleBackButton() {
    this.bbHideToggleVal = !this.bbHideToggleVal
    this.viewCtrl.hideBackButton(this.bbHideToggleVal);
  }
}


@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }
}
