import {IonicView, Device} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Vibration</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <h2>Device</h2>
    <button primary outline (click)="doDevice()">Get Device</button>
    <div>
    </div>
  </ion-content>
  `
})
export class DevicePage {

  doDevice() {
    let device = Device.getDevice();
    console.log('Got device', device);
  }
}
