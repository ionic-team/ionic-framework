angular.module('ionic.weather', ['ionic.weather.services', 'ionic.weather.directives'])

.constant('WUNDERGROUND_API_KEY', '1cc2d3de40fa5af0')

.constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')

.filter('int', function() {
  return function(v) {
    return parseInt(v) || '';
  };
})

.controller('WeatherCtrl', function($scope, Weather, Geo) {
  var _this = this;

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

  Geo.getLocation().then(function(position) {
    console.log('GOT LAT', position);

    _this.getCurrent(position.coords.latitude, position.coords.longitude);
  }, function(error) {
    alert('Unable to get current location: ' + error);
  });

});
