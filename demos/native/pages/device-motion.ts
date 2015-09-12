import {IonicView} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menu-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Motion</ion-title>
  </ion-navbar>
  <ion-content class="padding">
  </ion-content>
  `
})
export class DeviceMotionPage {

}
