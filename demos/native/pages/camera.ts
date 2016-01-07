import {IonicView} from 'ionic/ionic';

import {Camera} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Camera</ion-title>
  </ion-navbar>
  <ion-content padding>
    <h2>Camera</h2>
    <button primary outline (click)="getPicture()">Get Picture</button>
  </ion-content>
  `
})
export class CameraPage {
  constructor() {

  }
  getPicture() {
    Camera.getPicture({

    }).then(data => {
      console.log('Data', data);
    }, err => {
      alert('Unable to take picture')
    })
  }
}
