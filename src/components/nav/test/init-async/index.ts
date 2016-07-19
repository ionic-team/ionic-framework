import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  template: `
    <ion-content padding text-center>
      Page be loaded!
    </ion-content>
  `
})
class AsyncPage {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root: AsyncPage;

  constructor() {
    setTimeout(() => {
      this.root = AsyncPage;
    }, 1000);

  }
}

ionicBootstrap(E2EApp);
