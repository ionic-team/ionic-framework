import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Cards</h2>
    <p>
      Cards are an emerging UI concept where a bit of content is displayed
      like it would be on an index card or a piece of paper.
    </p>
    <p>
      Cards are great for displaying contextual information in a small space,
      like a Tweet, todays weather report, or a photo.
    </p>

    <ion-card>

      <ion-card-header>
        Card Header
      </ion-card-header>

      <div>
        <img src="http://i.imgur.com/7BEPcGo.jpg">
      </div>

    </ion-card>

  </ion-content>
  `
})
export class CardPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
}
