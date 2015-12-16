import {IonicView} from 'ionic/ionic';

import {StatusBar} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <icon menu></icon>
    </button>
    <ion-title>StatusBar</ion-title>
  </ion-navbar>
  <ion-content padding>
    <h2>StatusBar</h2>
    <div>
      <button primary outline (click)="hide()">Hide</button>
      <button primary outline (click)="show()">Show</button>
      <button primary outline (click)="toggleOverlays()">Toggle Overlays</button>
      <button primary outline (click)="setStyle()">Cycle Style</button>
    </div>
    <div>
      <div>
        <input [(ng-model)]="colorHex">
      </div>
      <button primary outline (click)="setColor()">Set Color</button>
    </div>
  </ion-content>
  `
})
export class StatusBarPage {
  constructor() {
    this.styles = [
      StatusBar.DEFAULT,
      StatusBar.LIGHT_CONTENT,
      StatusBar.BLACK_TRANSLUCENT,
      StatusBar.BLACK_OPAQUE
    ];
    this.currentStyle = 0;

    this.colorHex = '#fff';
  }
  hide() { StatusBar.hide(); }
  show() { StatusBar.show(); }
  toggleOverlays() {
    this.doesOverlay = !!!this.doesOverlay;
    StatusBar.setOverlays(this.doesOverlay);
  }
  setStyle() {
    StatusBar.setStyle(this.styles[++this.currentStyle]);
  }
  setColor() {
    console.log('Setting color', this.colorHex);
    StatusBar.setHexColor(this.colorHex);
  }
}
