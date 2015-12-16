import {IonicView, DeviceOrientation} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Orientation</ion-title>
  </ion-navbar>
  <ion-content padding>
    <div style="text-align: center">
      <img src="http://ionic-io-assets.s3.amazonaws.com/ionitron-avatar.png" [ng-style]="imageStyle">
    </div>
  </ion-content>
  `
})
export class DeviceOrientationPage {

  constructor() {
    this.imageStyle = {
      'max-width': '100%'
    }

    DeviceOrientation.watchHeading().source.subscribe((heading) => {
      this.imageStyle['-webkit-transform'] = 'rotate(' + heading.magneticHeading + 'deg)';
    });
  }
}
