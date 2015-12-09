import {IonicView, DeviceMotion} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menu-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Motion</ion-title>
  </ion-navbar>
  <ion-content padding>
    <div *ng-if="accel">{{accel.x}} {{accel.y}} {{accel.z}}</div>
  </ion-content>
  `
})
export class DeviceMotionPage {
  constructor() {
    DeviceMotion.watchAcceleration().source.subscribe((accel) => {
      this.accel = accel.acceleration;
    });
  }

}
