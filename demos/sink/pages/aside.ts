import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Aside</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Aside</h2>
    <p>
      Asides, also known as side menus or "hamburger" menus (mmmmm), are menus that slide
      or swipe in to show menus or information.
    </p>
    <p>
      Try it! Just swipe from the left edge of the screen to the right to expose
      the app menu, or tap the button to toggle the menu:
    </p>
    <p>
      <div class="height: 50px; background-color: E05780; width: 5px; margin-left: -15px"></div>
    </p>
    <p>
      <button (click)="toggleMenu()">Toggle</button>
    </p>
  </ion-content>
  `
})
export class AsidePage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
  openMenu() {

  }
}
