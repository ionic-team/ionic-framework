import {IonicView} from 'ionic/ionic';

import {Geolocation} from 'ionic/ionic';

@IonicView({
  template: `
  <ion-navbar *navbar>
    <button aside-toggle>
      <icon menu></icon>
    </button>
    <ion-title>Vibration</ion-title>
  </ion-navbar>
  <ion-content class="padding">
    <h2>Geolocation</h2>
    <button primary outline (click)="doGetLocation()">Get Location</button>
    <div>
      <b *ng-if="gettingLocation">Fetching location...</b>
      <b *ng-if="location">{{location.coords.latitude}}, {{location.coords.longitude}}</b>
    </div>
    <button primary outline (click)="doTrackLocation()">Track Location</button>
    <div>
      <b *ng-if="gettingTrackLocation">Fetching location...</b>
      <b *ng-if="trackLocation">{{trackLocation.coords.latitude}}, {{trackLocation.coords.longitude}}</b>
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
