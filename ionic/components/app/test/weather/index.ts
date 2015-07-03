import {Component, Directive} from 'angular2/angular2';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {IonicView, Animation, Modal, NavController, NavParams, IonicComponent} from 'ionic/ionic';

import {Geo} from './geo';
import {Weather} from './weather';
import {Flickr} from './flickr';

console.log('Imported', Geo, Weather, Flickr);

@Component({
  selector: 'ion-app',
})
@IonicView({
  templateUrl: 'main.html'
})
class WeatherApp {
  constructor(modal: Modal) {
    this.modal = Modal;

    this.currentLocationString = 'Madison, WI';
    this.current = {
      local_tz_short: 'CDT'
    };

    this.activeBgImageIndex = 0;

    /*
    $ionicPlatform.ready(function() {
      // Hide the status bar
      if(window.StatusBar) {
        StatusBar.hide();
      }
    });
    */

  }

  onInit() {
    this.refreshData();
  }

  showSettings() {
    this.modal.open(SettingsModal).then((settingsModal) => {
      this.settingsModal = settingsModal;
    });
  }

  getBackgroundImage(lat, lng, locString) {
    Flickr.search(locString, lat, lng).then((resp) => {
      let photos = resp.photos;
      if(photos.photo.length) {
        this.bgImages = photos.photo;
        this.cycleBgImages();
      }
    }, (error) => {
      console.error('Unable to get Flickr images', error);
    });
  }

  getCurrent(lat, lng, locString) {
    Weather.getAtLocation(lat, lng).then((resp) => {
      this.current = resp.data;
      console.log('GOT CURRENT', this.current);
    }, (error) => {
      alert('Unable to get current conditions');
      console.error(error);
    });
  }

  cycleBgImages() {
    setTimeout(() => {
      if(this.bgImages) {
        this.activeBgImage = this.bgImages[this.activeBgImageIndex++ % this.bgImages.length];
      }
    });
  }

  refreshData() {
    Geo.getLocation().then((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      Geo.reverseGeocode(lat, lng).then((locString) => {
        this.currentLocationString = locString;
        this.getBackgroundImage(lat, lng, locString);
      });

      this.getCurrent(lat, lng);
    }, (error) => {
      alert('Unable to get current location: ' + error);
    });
  }
}

/*
.controller('SettingsCtrl', function($scope, Settings) {
  $scope.settings = Settings.getSettings();

  // Watch deeply for settings changes, and save them
  // if necessary
  $scope.$watch('settings', function(v) {
    Settings.save();
  }, true);

  $scope.closeSettings = function() {
    $scope.modal.hide();
  };

});
*/

@IonicView({
  template: '<ion-view id="settings-modal"><ion-content padding><button primary (click)="close()">Close</button></ion-content></ion-view>'
})
export class SettingsModal {

}

export function main(ionicBootstrap) {
  ionicBootstrap(WeatherApp);
}
