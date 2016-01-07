import {IonicView} from 'ionic/ionic';

import {Geolocation} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Geolocation</ion-title>
  </ion-navbar>
  <ion-content padding>
    <h2>Geolocation</h2>
    <button primary outline (click)="doGetLocation()">Get Location</button>
    <div>
      <b *ngIf="gettingLocation">Fetching location...</b>
      <b *ngIf="location">{{location.coords.latitude}}, {{location.coords.longitude}}</b>
    </div>
    <button primary outline (click)="doTrackLocation()">Track Location</button>
    <div>
      <b *ngIf="gettingTrackLocation">Fetching location...</b>
      <b *ngIf="trackLocation">{{trackLocation.coords.latitude}}, {{trackLocation.coords.longitude}}</b>
    </div>
  </ion-content>
  `
})
export class GeolocationPage {
  doGetLocation() {
    console.log('Getting location');
    this.gettingLocation = true;
    Geolocation.getCurrentPosition().then((pos) => {
      this.gettingLocation = false;
      console.log('Got location', pos);
      this.location = pos;
    }, (err) => {
      this.gettingLocation = false;
      console.error('Unable to get location', err);
    });
  }
  doTrackLocation() {
    this.gettingTrackLocation = true;
    Geolocation.watchPosition().source.subscribe((pos) => {
      this.gettingTrackLocation = false;
      console.log('Got location', pos);
      this.trackLocation = pos;
    }, (err) => {
      this.gettingTrackLocation = false;
      console.error('Unable to get location', pos);
    });
  }
}
