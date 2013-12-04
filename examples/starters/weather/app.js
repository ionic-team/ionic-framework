angular.module('ionic.weather', ['ionic', 'ionic.weather.services', 'ionic.weather.directives'])

.constant('WUNDERGROUND_API_KEY', '1cc2d3de40fa5af0')

.constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')

.filter('int', function() {
  return function(v) {
    return parseInt(v) || '';
  };
})

.controller('WeatherCtrl', function($scope, $timeout, Weather, Geo, Flickr) {
  var _this = this;

  $scope.activeBgImageIndex = 0;

  $scope.getActiveBackgroundImage = function() {
    if($scope.activeBgImage) {
      var item = $scope.activeBgImage;
      var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_z.jpg";
      return {
        'background-image': 'url(' + url + ')'
      };
    }
  };

  this.getBackgroundImage = function(lat, lng) {
    Flickr.search('Madison, Wisconsin', lat, lng).then(function(resp) {
      var photos = resp.photos;
      if(photos.photo.length) {
        $scope.bgImages = photos.photo;
        _this.cycleBgImages();
      }
    }, function(error) {
      console.error('Unable to get Flickr images', error);
    });
  };

  this.getForecast = function(lat, lng) {
    Weather.getForecast(lat, lng).then(function(resp) {
      console.log('Forecast', resp);
      $scope.forecast = resp.forecast.simpleforecast;
    }, function(error) {
      alert('Unable to get forecast');
      console.error(error);
    });
  };

  this.getCurrent = function(lat, lng) {
    Weather.getAtLocation(lat, lng).then(function(resp) {
      $scope.current = resp.current_observation;
      _this.getForecast(resp.location.lat, resp.location.lon);
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });
  };

  this.cycleBgImages = function() {
    $timeout(function cycle() {
      if($scope.bgImages) {
        $scope.activeBgImage = $scope.bgImages[$scope.activeBgImageIndex++ % $scope.bgImages.length];
      }
      //$timeout(cycle, 10000);
    });
  };

  Geo.getLocation().then(function(position) {
    console.log('GOT LAT', position);
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    _this.getBackgroundImage(lat, lng);
    _this.getCurrent(lat, lng);
  }, function(error) {
    alert('Unable to get current location: ' + error);
  });

});
