import { Component, ViewEncapsulation } from '@angular/core';
import { App } from '../../../../..';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  template: `
    <ion-nav [root]="root"></ion-nav>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  root = PageOne;

  constructor(app: App) {
    app.viewDidLeave.subscribe((ev: any) => {
      console.log('App didLeave');
    });

    app.viewWillLeave.subscribe((ev: any) => {
      console.log('App willLeave');
    });
  }
}
