import {Component, Type} from 'angular2/core';
import {App, NavController, Alert} from 'ionic-angular';
import {Page, Config, IonicApp} from 'ionic-angular';
import {NavParams, ViewController, IONIC_DIRECTIVES} from 'ionic-angular';;


@Component({
  selector: 'my-cmp',
  template: `<p>My Custom Component Test <ion-icon name="star"></ion-icon></p>`,
  directives: [IONIC_DIRECTIVES]
})
class MyCmpTest{}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>{{title}}</ion-title>
      <ion-buttons start>
        <button><ion-icon name="star"></ion-icon></button>
      </ion-buttons>
      <ion-buttons end>
        <button>S1g</button>
      </ion-buttons>
    </ion-navbar>
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

        <button ion-item [navPush]="[pushPage, {id: 42}]">Push FullPage w/ [navPush] array</button>
        <button ion-item [navPush]="pushPage" [navParams]="{id:40}">Push w/ [navPush] and [navParams]</button>
        <button ion-item [navPush]="[\'FirstPage\', {id: 22}]">Push w/ [navPush] array and string view name</button>
        <button ion-item [navPush]="FirstPage" [navParams]="{id: 23}">Push w/ [navPush] and [navParams]</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="nav.pop()">Pop</button>
        <button ion-item (click)="viewDismiss()">View Dismiss</button>
        <button ion-item (click)="quickPush()">New push during transition</button>
        <button ion-item (click)="quickPop()">New pop during transition</button>
        <button ion-item (click)="reload()">Reload</button>

        <button *ngFor="#i of pages" ion-item (click)="pushPrimaryHeaderPage()">Page {{i}}</button>
      </ion-list>
      <my-cmp></my-cmp>
    </ion-content>`,
  directives: [MyCmpTest]
})
class FirstPage {
  pushPage;
  title = 'First Page';
  pages: Array<number> = [];

  constructor(
    private nav: NavController,
    private view: ViewController
  ) {
    this.pushPage = FullPage;

    for (var i = 1; i <= 50; i++) {
      this.pages.push(i);
    }
  }

  setPages() {
    let items = [
      { page: PrimaryHeaderPage }
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
    this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  quickPush() {
    this.nav.push(AnotherPage);
    setTimeout(() => {
      this.nav.push(PrimaryHeaderPage);
    }, 150);
  }

  quickPop() {
    this.nav.push(AnotherPage);
    setTimeout(() => {
      this.nav.remove(1, 1);
    }, 250);
  }

  viewDismiss() {
    this.view.dismiss();
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
      <p><button (click)="presentAlert()">Present Alert</button></p>
    </ion-content>
  `
})
class FullPage {
  constructor(
    private nav: NavController,
    private params: NavParams
  ) {}

  setPages() {
    let items = [
      { page: FirstPage },
      { page: PrimaryHeaderPage }
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

  presentAlert() {
    let alert = Alert.create();
    alert.setTitle('Hello Alert');
    alert.setMessage('Dismiss this alert, then pop one page');
    alert.addButton({
      text: 'Dismiss',
      role: 'cancel',
      handler: () => {
        // overlays are added and removed from the root navigation
        // ensure you using the root navigation, and pop this alert
        // when the alert is done animating out, then pop off the active page
        this.nav.rootNav.pop().then(() => {
          this.nav.rootNav.pop();
        });

        // by default an alert will dismiss itself
        // however, we don't want to use the default
        // but rather fire off our own pop navigation
        // return false so it doesn't pop automatically
        return false;
      }
    });
    this.nav.present(alert);
  }

}


@Page({
  template: `
    <ion-navbar *navbar primary>
      <ion-title>Primary Color Page Header</ion-title>
      <ion-buttons end>
        <button>S1g</button>
      </ion-buttons>
    </ion-navbar>
    <ion-content padding>
      <p><button class="e2eFrom3To2" (click)="nav.pop()">Pop</button></p>
      <p><button (click)="pushAnother()">Push to AnotherPage</button></p>
      <p><button (click)="pushFullPage()">Push to FullPage</button></p>
      <p><button (click)="setRoot()">setRoot(AnotherPage)</button></p>
      <p><button (click)="nav.popToRoot()">Pop to root</button></p>
      <p><button id="insert" (click)="insert()">Insert first page into history before this</button></p>
      <p><button id="remove" (click)="removeSecond()">Remove second page in history</button></p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
      <ion-fixed style="bottom:0">
        <button (click)="presentAlert()">fixed button (alert)</button>
      </ion-fixed>
      <ion-fixed style="pointer-events: none; top:0; bottom:0; right:0; width:50%; background: rgba(0,0,0,0.5);"></ion-fixed>
    </ion-content>
  `
})
class PrimaryHeaderPage {
  constructor(
    private nav: NavController,
    private viewCtrl: ViewController
  ) {}

  onPageWillEnter() {
    this.viewCtrl.setBackButtonText('Previous');
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
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

  presentAlert() {
    let alert = Alert.create();
    alert.setTitle('Hello Alert');
    alert.addButton({ text: 'Dismiss', role: 'cancel', });
    this.nav.present(alert);
  }
}


@Page({
  template: `
    <ion-navbar *navbar hideBackButton>
      <ion-title>Another Page Header</ion-title>
    </ion-navbar>
    <ion-content>
      <ion-list>

        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>

        <ion-item>Back button hidden w/ <code>ion-navbar hideBackButton</code></ion-item>
        <button ion-item (click)="nav.pop()">Pop</button>
        <button ion-item (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushFirstPage()">Push to FirstPage</button>
        <button ion-item (click)="setRoot()">setRoot(FirstPage)</button>
        <button ion-item (click)="toggleBackButton()">Toggle hideBackButton</button>
        <button ion-item (click)="setBackButtonText()">Set Back Button Text</button>
      </ion-list>
    </ion-content>
  `
})
class AnotherPage {
  bbHideToggleVal = false;
  bbCount = 0;

  constructor(
    private nav: NavController,
    private viewCtrl: ViewController
  ) {
    console.log('Page, AnotherPage, constructor', this.viewCtrl.id);
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

    if (this.bbCount > 0) {
      backButtonText += ` (${this.bbCount})`;
    }

    this.viewCtrl.setBackButtonText(backButtonText);
    ++this.bbCount;
  }

  onPageWillEnter() {
    console.log('Page, AnotherPage, onPageWillEnter', this.viewCtrl.id);
  }

  onPageDidEnter() {
    console.log('Page, AnotherPage, onPageDidEnter', this.viewCtrl.id);
  }

  onPageWillLeave() {
    console.log('Page, AnotherPage, onPageWillLeave', this.viewCtrl.id);
  }

  onPageDidLeave() {
    console.log('Page, AnotherPage, onPageDidLeave', this.viewCtrl.id);
  }

  onPageWillUnload() {
    console.log('Page, AnotherPage, onPageWillUnload', this.viewCtrl.id);
  }

  onPageDidUnload() {
    console.log('Page, AnotherPage, onPageDidUnload', this.viewCtrl.id);
  }

  ngOnDestroy() {
    console.log('Page, AnotherPage, ngOnDestroy', this.viewCtrl.id);
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
  root;

  constructor() {
    this.root = FirstPage;
  }

  get isChangeDetecting() {
    console.log('isChangeDetecting');
    return true;
  }
}
