import {IonicView} from 'ionic/ionic';

import {Vibration} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <a menu-toggle>
      <icon menu></icon>
    </a>
    <ion-title>Vibration</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <h2>Vibration</h2>
    <button primary outline (click)="doVibrate()">Vibrate</button>
  </ion-content>
  `
})
export class VibrationPage {
  doVibrate() {
    Vibration.vibrate(1000);
  }
}
