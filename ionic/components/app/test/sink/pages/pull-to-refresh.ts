import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Pull to Refresh</ion-title></ion-navbar>

  <ion-content>
    <ion-refresher (starting)="doStarting()" (refresh)="doRefresh($event, refresher)" (pulling)="doPulling($event, amt)">
    </ion-refresher>
    <ion-list inset>
      <ion-item *ng-for="#item of items">
        {{item.title}}
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class PullToRefreshPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);

    this.items = [];
    for(let i = 90; i < 100; i++) {
      this.items.push({
        title: i
      });
    }
    this.i = 90;
  }
  doRefresh(refresher) {
    console.log('DOREFRESH', refresher)

    this.items.unshift({
      title: (--this.i)
    });

    setTimeout(() => {
      refresher.complete();
    }, 1500)
  }
  doStarting() {
    console.log('DOSTARTING');
  }
  doPulling(amt) {
    console.log('DOPULLING', amt);
  }
}
