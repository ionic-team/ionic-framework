import {Component, Directive, View} from 'angular2/angular2';
import {NgIf, NgFor, CSSClass, ElementRef} from 'angular2/angular2';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {IonicView, Animation, Content, Scroll, Modal, NavController, NavParams, IonicComponent} from 'ionic/ionic';

import {Geo} from './geo';
import {Weather} from './weather';
import {Flickr} from './flickr';

@Component({
  selector: 'ion-app'
})
@View({
  templateUrl: 'main.html',
  directives: [NgIf, NgFor, Content, Scroll, CurrentWeather, WeatherIcon, BackgroundCycler]
})
class WeatherApp {
  constructor(modal: Modal) {
    this.modal = modal;

    this.currentLocationString = 'Madison, WI';

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
      this.current = resp;

      // TODO: This should be in a custom pipe
      let c, d, h;
      for(let i = 0; i < this.current.hourly.data.length; i++) {
        c = this.current.hourly.data[i];
        let t = c.temperature;
        d = new Date(c.time * 1000);
        c.temperature = Math.floor(t);
        h = d.getHours() % 12;
        h = (h == 0 ? 12 : h);
        c.time_date = h + ' ' + (d.getHours() < 12 ? 'AM' : 'PM');
      }
      for(let i = 0; i < this.current.daily.data.length; i++) {
        c = this.current.daily.data[i];
        let max = c.temperatureMax;
        let min = c.temperatureMin;
        c.temperatureMax = Math.floor(max);
        c.temperatureMin = Math.floor(min);
        c.time_date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(c.time*1000).getDay()];
      }
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
  template: `<ion-view id="settings-modal">
    <ion-toolbar><ion-title>Settings</ion-title></ion-toolbar>
    <ion-content padding>
      <form (^submit)="doSubmit($event)" [ng-form-model]="settingsForm">
        <ion-list>
          <ion-input ion-item>
            <ion-label>Units</ion-label>
            <!--
            <ion-segment ng-control="units">
              <ion-segment-button value="standard" button>
                &deg;F
              </ion-segment-button>
              <ion-segment-button value="standard" button>
                &deg;C
              </ion-segment-button>
            </ion-segment>
            -->
          </ion-input>
        </ion-list>
      </form>
    </ion-content>
  </ion-view>`,
  directives: [formDirectives]
})
export class SettingsModal {
  constructor(fb: FormBuilder) {
    this.settingsForm = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(WeatherApp);
}


let WEATHER_ICONS = {
  'partlycloudy': 'ion-ios-partlysunny-outline',
  'mostlycloudy': 'ion-ios-partlysunny-outline',
  'cloudy': 'ion-ios-cloudy-outline',
  'rain': 'ion-ios-rainy-outline',
  'tstorms': 'ion-ios-thunderstorm-outline',
  'sunny': 'ion-ios-sunny-outline',
  'clear-day': 'ion-ios-sunny-outline',
  'nt_clear': 'ion-ios-moon-outline',
  'clear-night': 'ion-ios-moon-outline'
};

@Component({
  selector: 'weather-icon',
  properties: [
    'icon'
  ]
})
@View({
  template: '<i class="icon" [class]="weatherIcon"></i>',
  directives: [CSSClass]
})
export class WeatherIcon {
  constructor() {
  }
  onAllChangesDone(data) {
    var icon = this.icon;

    if(icon in WEATHER_ICONS) {
      this.weatherIcon = WEATHER_ICONS[icon];
    } else {
      this.weatherIcon = WEATHER_ICONS['cloudy'];
    }
  }
}

@Component({
  selector: 'current-time',
  properties: [
    'localtz'
  ]
})
@View({
  template: '<span class="current-time">{{currentTime}}</span>',
})
export class CurrentTime {
  constructor() {
  }
  onInit() {
    if(this.localtz) {
      this.currentTime = new Date();
      //this.currentTime = //$filter('date')(+(new Date), 'h:mm') + $scope.localtz;
    }
  }
}

@Component({
  selector: 'current-weather',
  properties: [
    'current'
  ]
})
@View({
  templateUrl: 'current-weather.html',
  directives: [NgIf]
})
export class CurrentWeather {
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;

    /*
    $rootScope.$on('settings.changed', function(settings) {
      var units = Settings.get('tempUnits');

      if($scope.forecast) {

        var forecast = $scope.forecast;
        var current = $scope.current;

        if(units == 'f') {
          $scope.highTemp = forecast.forecastday[0].high.fahrenheit;
          $scope.lowTemp = forecast.forecastday[0].low.fahrenheit;
          $scope.currentTemp = Math.floor(current.temp_f);
        } else {
          $scope.highTemp = forecast.forecastday[0].high.celsius;
          $scope.lowTemp = forecast.forecastday[0].low.celsius;
          $scope.currentTemp = Math.floor(current.temp_c);
        }
      }
    });
    */

      // Delay so we are in the DOM and can calculate sizes
  }

  onInit() {
    var windowHeight = window.innerHeight;
    var thisHeight = this.elementRef.nativeElement.offsetHeight;
    var headerHeight = document.querySelector('#header').offsetHeight;
    this.elementRef.nativeElement.style.paddingTop = (windowHeight - 250) + 'px';
    /*
    document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
    $timeout(function() {
      angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
    }, 50);
    */
  }
  onAllChangesDone() {
    var units = 'f';//Settings.get('tempUnits');

    let current = this.current;

    console.log('ALL CHANGES DONE', current);

    if(current && current.currently) {
      if(units == 'f') {
        this.currentTemp = Math.floor(current.currently.temperature);
      } else {
        this.currentTemp = Math.floor(current.currently.temperature);
      }
      if(units == 'f') {
        this.highTemp = Math.floor(current.daily.data[0].temperatureMax);
        this.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
      } else {
        this.highTemp = Math.floor(current.daily.data[0].temperatureMax);
        this.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
      }
    }
  }
}

@Component({
  selector: 'background-cycler',
  properties: [
    'image'
  ]
})
@View({
  template: '<div class="bg-image"></div>'
})
export class BackgroundCycler {
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
    this.el = elementRef.nativeElement;
  }
  onInit() {
    this.imageEl = this.el.children[0];
  }
  onAllChangesDone() {
    var item = this.image;
    if(item) {
      var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
      this.imageEl.style.backgroundImage = 'url(' + url + ')';
    }
  }
}

/*
.directive('weatherBox', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '@'
    },
    template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
    link: function($scope, $element, $attr) {
    }
  }
})

.directive('scrollEffects', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header;
      var bg = document.querySelector('.bg-image');
      $element.bind('scroll', function(e) {
        if(!header) {
          header = document.getElementById('header');
        }
        st = e.detail.scrollTop;
        if(st >= 0) {
          header.style.webkitTransform = 'translate3d(0, 0, 0)';
        } else if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
        amt = Math.min(0.6, st / 1000);

        ionic.requestAnimationFrame(function() {
          header.style.opacty = 1 - amt;
          if(bg) {
            bg.style.opacity = 1 - amt;
          }
        });
      });
    }
  }
})


*/
