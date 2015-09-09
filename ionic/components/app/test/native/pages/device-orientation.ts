import {IonicView, DeviceOrientation} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Motion</ion-title>
  </ion-navbar>
  <ion-content class="padding">
  </ion-content>
  `
})
export class DeviceMotionPage {
  constructor() {
    let device = DeviceOrientation.watchHeading().source.subscribe((resp) => {
      console.log('Device orientation', resp);
    }, (err) => {
      console.log('Device err', err);
    });
  }
}
