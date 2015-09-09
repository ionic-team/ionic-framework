import {IonicView, DeviceMotion} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Motion</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <button primary outline (click)="doDeviceMotion()">Get Device Motion</button>
    <div *ng-if="accel">
      x: <b>{{accel.x}}</b><br>
      y: <b>{{accel.y}}</b><br>
      z: <b>{{accel.z}}</b><br>
    </div>
    <button primary outline (click)="doDeviceMotionWatch()">Track Device Motion</button>
    <div *ng-if="accelTrack">
      x: <b>{{accelTrack.x}}</b><br>
      y: <b>{{accelTrack.y}}</b><br>
      z: <b>{{accelTrack.z}}</b><br>
    </div>
  </ion-content>
  `
})
export class DeviceMotionPage {
  doDeviceMotion() {
    let device = DeviceMotion.getCurrentAcceleration().then((resp) => {
      console.log('Device motion', resp);
      this.accel = resp.accelerationIncludingGravity;
    }, (err) => {
      console.log('Device err', err);
    });
    console.log('Got device', device);
  }
  doDeviceMotionWatch() {
    let device = DeviceMotion.watchAcceleration().source.subscribe((resp) => {
      console.log('Device motion track', resp);
      this.accelTrack = resp.accelerationIncludingGravity;
    }, (err) => {
      console.log('Device err', err);
    });
    console.log('Got device', device);
  }
}
