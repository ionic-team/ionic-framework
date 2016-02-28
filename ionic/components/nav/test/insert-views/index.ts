import {App, Page, NavController} from 'ionic-angular';



@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Root</ion-title>
    </ion-navbar>

    <ion-content padding>
    <button block (click)="pushPage()">Push Page</button>
    </ion-content>`,
})
class FirstPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  pushPage() {
    this.nav.push(SecondPage)
  }
}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Root</ion-title>
    </ion-navbar>

    <ion-content padding>
      <h1>Second page</h1>
    <button block (click)="insertPage()">Insert Page</button>
    </ion-content>
  `
})
class SecondPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  insertPage() {
    this.nav.insert(1, InsertPage)
  }
}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Inserted Paged</ion-title>
    </ion-navbar>
    <ion-content padding>
      Inserted Page
    </ion-content>
  `
})
class InsertPage {
  constructor() { }
}



@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  constructor() {
    this.root = FirstPage;
  }
}
