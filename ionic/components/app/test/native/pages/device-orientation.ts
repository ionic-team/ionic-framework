import {IonicView, DeviceOrientation} from 'ionic/ionic';

import {CSS} from 'ionic/util/dom';

import {NgStyle, forwardRef, Host, Component, View, ElementRef} from 'angular2/angular2';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Device Orientation</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <div [ng-style]="imageStyle"><img src="http://ionic-io-assets.s3.amazonaws.com/ionitron-love.png" style="max-width: 100%"></div>
  </ion-content>
  `
})
export class DeviceOrientationPage {
  constructor() {
    this.imageStyle = {
    }
  }
  onInit() {
    let device = DeviceOrientation.watchHeading().source.subscribe((resp) => {
      this.orientation = resp;
      this.imageStyle['-webkit-transform'] = 'rotate(' + (resp.alpha || 100) + 'deg)';
    }, (err) => {
      console.log('Device err', err);
    });
  }
}
