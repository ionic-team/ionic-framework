import {Component} from 'angular2/angular2';
import {Control, ControlGroup} from 'angular2/forms';

import {App, Http, Camera, Geolocation} from 'ionic/ionic';

let testUrl = 'https://ionic-api-tester.herokuapp.com/json';
let testUrl404 = 'https://ionic-api-tester.herokuapp.com/404';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
  }
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
  getPicture() {
    Camera.getPicture({

    }).then(data => {
      console.log('Data', data);
    }, err => {
      alert('Unable to take picture')
    })
  }
}
