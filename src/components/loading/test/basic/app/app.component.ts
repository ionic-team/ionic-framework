import { Component, ViewEncapsulation } from '@angular/core';
import { App } from '../../../../..';
import { E2EPage } from '../pages/e2e-page/e2e-page';

@Component({
  template: `
    <ion-nav [root]="root"></ion-nav>
  `,
  encapsulation: ViewEncapsulation.None
})
export class E2EApp {
  root = E2EPage;

  constructor(app: App) {
    app.viewDidLeave.subscribe((ev: any) => {
      console.log('App didLeave');
    });

    app.viewWillLeave.subscribe((ev: any) => {
      console.log('App willLeave');
    });
  }
}
