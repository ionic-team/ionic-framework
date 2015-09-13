import {IonicView} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <a menu-toggle>
      <icon menu></icon>
    </a>
    <ion-title>Device Motion</ion-title>
  </ion-navbar>
  <ion-content class="padding">
  </ion-content>
  `
})
export class DeviceMotionPage {

}
