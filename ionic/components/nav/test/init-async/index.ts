import {App, Page} from 'ionic-angular';


@Page({
  template: `
    <ion-content padding text-center>
      Page be loaded!
    </ion-content>
  `
})
class AsyncPage {}


@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root;

  constructor() {
    setTimeout(() => {
      this.root = AsyncPage;
    }, 1000);

  }
}
