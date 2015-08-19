import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Lists</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Lists</h2>
    <p>
      Lists display data as rows in a table.
    </p>
    <p>
      Lists are great for displaying sets of things like contacts,
      songs, and documents.
    </p>

    <ion-list inset>

      <ion-header>
        List Header
      </ion-header>

      <ion-item>
        <input control="email" type="email" placeholder="Your email">
      </ion-item>
      <div class="item">
        <div class="item-content">
          <div class="item-title">
            Item
          </div>
        </div>
      </div>
      <ion-item>Item</ion-item>

    </ion-list>
  </ion-content>
  `
})
export class ListPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app)
  }
}
