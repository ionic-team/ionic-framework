angular.module('ionic.weather', ['ionic.weather.services', 'ionic.weather.directives'])

.constant('API_KEY', '1cc2d3de40fa5af0')

.filter('int', function() {
  return function(v) {
    return parseInt(v) || '';
  };
})

.controller('WeatherCtrl', function($scope, Weather) {

  Weather.getAtCurrentLocation(function(resp) {
    $scope.current = resp.current_observation;
  });
});
