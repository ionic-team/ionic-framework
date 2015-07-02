import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {NgIf} from 'angular2/angular2';
import {FormBuilder, Control, ControlGroup, Validators, formDirectives} from 'angular2/forms';

import {IonicView, Animation, Modal, NavController, NavParams, IonicComponent} from 'ionic/ionic';

import {Geo} from './geo';
import {Weather} from './weather';
import {Flickr} from './flickr';

console.log('Imported', Geo, Weather, Flickr);

@Component({
  selector: 'ion-app',
  appInjector: [Modal]
})
@IonicView({
  templateUrl: 'main.html',
  directives: [CurrentWeather]
})
class WeatherApp {
  constructor(Modal: Modal) {
    this.Modal = Modal;

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
    this.Modal.show(SettingsModal).then((settingsModal) => {
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

@IonicComponent(Modal)
@IonicView({
  template: '<ion-view id="settings-modal"><ion-content padding><button primary (click)="close()">Close</button></ion-content></ion-view>'
})
export class SettingsModal extends Modal {}

export function main(ionicBootstrap) {
  ionicBootstrap(WeatherApp);
}


let WEATHER_ICONS = {
  'partlycloudy': 'ion-ios7-partlysunny-outline',
  'mostlycloudy': 'ion-ios7-partlysunny-outline',
  'cloudy': 'ion-ios7-cloudy-outline',
  'rain': 'ion-ios7-rainy-outline',
  'tstorms': 'ion-ios7-thunderstorm-outline',
  'sunny': 'ion-ios7-sunny-outline',
  'clear-day': 'ion-ios7-sunny-outline',
  'nt_clear': 'ion-ios7-moon-outline',
  'clear-night': 'ion-ios7-moon-outline'
};

@Component({
  selector: 'weather-icon',
  properties: [
    'icon'
  ]
})
@View({
  template: '<i class="icon" [class]="weatherIcon"></i>',
})
export class WeatherIcon {
  constructor() {
  }
  onChange(data) {
    console.log('Weather icon onchange', data);

    /*
    var icon = v;

    if(icon in WEATHER_ICONS) {
      $scope.weatherIcon = WEATHER_ICONS[icon];
    } else {
      $scope.weatherIcon = WEATHER_ICONS['cloudy'];
    }
    */
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
  constructor() {
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
      /*
      $timeout(function() {
        var windowHeight = window.innerHeight;
        var thisHeight = $element[0].offsetHeight;
        var headerHeight = document.querySelector('#header').offsetHeight;
        $element[0].style.paddingTop = (windowHeight - (thisHeight)) + 'px';
        angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
        $timeout(function() {
          angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
        }, 50);
      });
      */
  }

  onAllChangesDone() {
    var units = 'f';//Settings.get('tempUnits');

    let current = this.current;

    console.log('ALL CHANGES DONE', current);

    if(current) {
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

/*
.directive('forecast', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/forecast.html',
    link: function($scope, $element, $attr) {
    }
  }
})

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

.directive('backgroundCycler', function($compile, $animate) {
  var animate = function($scope, $element, newImageUrl) {
    var child = $element.children()[0];

    var scope = $scope.$new();
    scope.url = newImageUrl;
    var img = $compile('<background-image></background-image>')(scope);

    $animate.enter(img, $element, null, function() {
      console.log('Inserted');
    });
    if(child) {
      $animate.leave(angular.element(child), function() {
        console.log('Removed');
      });
    }
  };

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $scope.$watch('activeBgImage', function(v) {
        if(!v) { return; }
        console.log('Active bg image changed', v);
        var item = v;
        var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
        animate($scope, $element, url);
      });
    }
  }
})

.directive('backgroundImage', function($compile, $animate) {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      if($scope.url) {
        $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
      }
    }
  }
});

*/
