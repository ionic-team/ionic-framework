import {Component} from 'angular2/angular2';
import {App, NavController} from 'ionic/ionic';
import {Page, Config, IonicApp} from 'ionic/ionic';
import {NavParams, NavController, ViewController, IONIC_DIRECTIVES} from 'ionic/ionic';


@Component({
  selector: 'my-cmp',
  template: `<p>My Custom Component Test <icon star></icon></p>`,
  directives: [IONIC_DIRECTIVES]
})
class MyCmpTest{}


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
    <ion-content>
      <ion-list>
        <ion-list-header>
          {{title}}
        </ion-list-header>

        <button ion-item class="e2eFrom1To2" (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushAnother()">Push to AnotherPage</button>
        <button ion-item [nav-push]="[pushPage, {id: 42}]">Push FullPage w/ [nav-push] array</button>
        <button ion-item [nav-push]="pushPage" [nav-params]="{id:40}">Push w/ [nav-push] and [nav-params]</button>
        <button ion-item [nav-push]="[\'FirstPage\', {id: 22}]">Push w/ [nav-push] array and string view name</button>
        <button ion-item nav-push="FirstPage" [nav-params]="{id: 23}">Push w/ nav-push and [nav-params]</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="nav.pop()">Pop</button>
        <button ion-item (click)="reload()">Reload</button>

        <button *ng-for="#i of pages" ion-item (click)="pushPrimaryHeaderPage()">Page {{i}}</button>
      </ion-list>
      <my-cmp></my-cmp>
    </ion-content>`,
  directives: [MyCmpTest]
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

    this.pages = [];
    for (var i = 1; i <= 50; i++) {
      this.pages.push(i);
    }
  }

  setPages() {
    let items = [
      PrimaryHeaderPage
    ];

    this.nav.setPages(items);
  }

  setRoot() {
    this.nav.setRoot(PrimaryHeaderPage);
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

  reload() {
    window.location.reload();
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
      <p><button (click)="setPages()">setPages() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>
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

  setPages() {
    let items = [
      FirstPage,
      PrimaryHeaderPage
    ];

    this.nav.setPages(items);
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
      <p><button (click)="setRoot()">setRoot(AnotherPage)</button></p>
      <p><button id="insert" (click)="insert()">Insert first page into history before this</button></p>
      <p><button id="remove" (click)="removeSecond()">Remove second page in history</button></p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
class PrimaryHeaderPage {
  constructor(
    nav: NavController,
    viewCtrl: ViewController
  ) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
  }

  onPageWillEnter() {
    this.viewCtrl.setBackButtonText('Previous');
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1,2,3,4] } );
  }

  insert() {
    this.nav.insert(2, FirstPage);
  }

  removeSecond() {
    this.nav.remove(1);
  }

  setRoot() {
    this.nav.setRoot(AnotherPage);
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
      <p><button (click)="setRoot()">setRoot(FirstPage)</button></p>
      <p><button (click)="toggleBackButton()">Toggle hide-back-button</button></p>
      <p><button (click)="setBackButtonText()">Set Back Button Text</button></p>
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
    this.bbHideToggleVal = false;
    this._bbCount = 0;
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

  setRoot() {
    this.nav.setRoot(FirstPage);
  }

  toggleBackButton() {
    this.bbHideToggleVal = !this.bbHideToggleVal
    this.viewCtrl.showBackButton(this.bbHideToggleVal);
  }

  setBackButtonText() {
    let backButtonText = 'Messages';

    if (this._bbCount > 0) {
      backButtonText += ` (${this._bbCount})`;
    }

    this.viewCtrl.setBackButtonText(backButtonText);
    ++this._bbCount;
  }
}


@App({
  pages: [FirstPage, FullPage, PrimaryHeaderPage, AnotherPage],
  template: `<ion-nav [root]="root"></ion-nav>`,
  host: {
    '[class.is-change-detecting]': 'isChangeDetecting'
  }
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }

  get isChangeDetecting() {
    console.log('isChangeDetecting');
    return true;
  }
}
