import {IonicView, Device} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menu-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device</ion-title>
  </ion-navbar>
  <ion-content padding>
    <h2>Device</h2>
    <button primary outline (click)="doDevice()">Get Device</button>
    <div *ng-if="device">
      Device name: {{device.name}}
    </div>
  </ion-content>
  `
})
export class DevicePage {

  doDevice() {
    this.device = Device.getDevice();
    console.log('Got device', this.device);
  }
}
