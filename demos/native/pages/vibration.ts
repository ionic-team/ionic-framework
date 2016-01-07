import {IonicView} from 'ionic/ionic';

import {Vibration} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Vibration</ion-title>
  </ion-navbar>
  <ion-content padding>
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
