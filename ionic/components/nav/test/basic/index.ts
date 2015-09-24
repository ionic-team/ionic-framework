import {App, NavController} from 'ionic/ionic';
import {IonicView, IonicConfig, IonicApp} from 'ionic/ionic';
import {NavParams, NavController} from 'ionic/ionic';


@IonicView({
  template: '' +
    '<ion-navbar *navbar primary>' +
      '<ion-title>{{title}}</ion-title>' +
      '<ion-nav-items primary>' +
        '<button><icon star></icon></button>' +
      '</ion-nav-items>' +
      '<ion-nav-items secondary>' +
        '<button>S1</button>' +
      '</ion-nav-items>' +
    '</ion-navbar>' +
    '<ion-content padding>' +
      '<p>{{title}}</p>' +
      '<p><button id="from1To2" primary (click)="push()">Push (Go to 2nd)</button></p>' +
      '<p><button [nav-push]="[pushPage, {id: 42}]">Push w/ nav-push (Go to 2nd)</button></p>' +
      '<p><button (click)="setViews()">setViews() (Go to 3rd, no history)</button></p>' +
      '<icon class="ion-ios-arrow-back"></icon>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class FirstPage {
  constructor(
    nav: NavController,
    app: IonicApp,
    config: IonicConfig
  ) {
    this.nav = nav;
    this.title = 'First Page';

    this.pushPage = SecondPage;
  }

  setViews() {
    let items = [
      ThirdPage
    ];

    this.nav.setViews(items);
  }

  push() {
    this.nav.push(SecondPage, { id: 8675309, myData: [1,2,3,4] } );
  }
}


@IonicView({
  template: `
    <ion-content padding>
      <h1>Second page</h1>
      <p>This page does not have a nav bar!</p>
      <p><button (click)="pop()">Pop (Go back to 1st)</button></p>
      <p><button id="from2To1" nav-pop>Pop with NavPop (Go back to 1st)</button></p>
      <p><button id="from2To3" (click)="push()">Push (Go to 3rd)</button></p>
      <p><button (click)="setViews()">setViews() (Go to 3rd, FirstPage 1st in history)</button></p>
      <div class="green"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
class SecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;

    console.log('Second page params:', params);
  }

  setViews() {
    let items = [
      FirstPage,
      ThirdPage
    ];

    this.nav.setViews(items);
  }

  pop() {
    this.nav.pop();
  }

  push() {
    this.nav.push(ThirdPage);
  }

}


@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>Third Page Header</ion-title></ion-navbar>
    <ion-content padding>
      <p>
        <button id="from3To2" (click)="pop()">Pop (Go back to 2nd)</button>
        <button id="insert" (click)="insert()">Insert first page into history before this</button>
      </p>
      <div class="yellow"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
class ThirdPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }

  pop() {
    this.nav.pop()
  }

  insert() {
    this.nav.insert(FirstPage, 2);
  }

}



@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }
}
