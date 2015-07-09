import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Icons</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Icons</h2>
    <p>
      Ionic comes with a totally free (in price and license), icon pack (known as "Ionicons") with over 700
      icons for your app.
    </p>
    <p>
      Ionicons is an icon font, and can be used with simple CSS icon classes (recommended), or
      with unicode characters.
    </p>
    <div>
      <img src="http://ionic-io-assets.s3.amazonaws.com/v2/ionicons.png" style="max-width: 100%">
    </div>
  </ion-content>
  `
})
export class IconsPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
}
