import {App, NavController} from 'ionic/ionic';
import {IonicView, IonicConfig, IonicApp} from 'ionic/ionic';
import {NavParams, NavController} from 'ionic/ionic';


@IonicView({
  template: '' +
    '<ion-navbar *navbar primary>' +
      '<ion-title>{{title}}</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<h1>{{title}}</h1>' +
      '<p><button id="from1To2" secondary (click)="push()">(Push) Go to Second Page</button></p>' +
      '<p><button secondary [push-data]="pushData" [nav-push]="pushPage">(Nav-Push) Go to Second Page</button></p>' +
      '<p><button danger (click)="setItems()">(setItems) Go to Third Page</button></p>' +
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
    this.pushData = {
      id: 420
    }
  }

  setItems() {
    let items = [
      ThirdPage
    ];
    this.nav.setItems(items);
  }

  push() {
    this.nav.push(SecondPage, { id: 8675309, myData: [1,2,3,4] } );
  }
}


@IonicView({
  template: `
    <ion-navbar secondary *navbar>
      <ion-title>{{title}}</ion-title>
    </ion-navbar>
    <ion-content class="padding">
      <h1>Second page</h1>
      <p><button (click)="pop()">(Pop) Go back to First Page</button></p>
      <p><button id="from2To1" nav-pop>(NavPop) Go back to First Page</button></p>
      <p><button danger id="from2To3" (click)="push()">(Push) Go to Third Page</button></p>
      <p><button danger (click)="setItems()">(setItems) Go to Third Page</button></p>
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

  setItems() {
    let items = [
      FirstPage,
      ThirdPage
    ];
    this.nav.setItems(items);
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
    <ion-navbar danger *navbar>
      <ion-title>Third Page Header</ion-title>
    </ion-navbar>
    <ion-content class="padding">
      <p>
        <button secondary id="from3To2" (click)="pop()">(Pop) Go back to Second Page</button>
      </p>
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

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class DemoApp {
  constructor() {
    this.root = FirstPage;
  }
}
