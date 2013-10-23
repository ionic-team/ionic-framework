angular.module('ionic.weather.services', ['ngResource'])

.factory('Weather', function($resource, API_KEY) {
  var baseUrl = 'http://api.wunderground.com/api/' + API_KEY;

  var locationResource = $resource(baseUrl + '/geolookup/conditions/q/:coords.json', {
    callback: 'JSON_CALLBACK'
  }, {
    get: {
      method: 'JSONP'
    }
  });
  return {
    getAtCurrentLocation: function(cb) {
      var _this = this;

      navigator.geolocation.getCurrentPosition(function(position) {
        _this.getAtLocation(position.coords.latitude, position.coords.longitude, cb);
      }, function(error) {
        alert('Unable to get current location: ' + error);
      });

    },
    getAtLocation: function(lat,lng, cb) {
      locationResource.get({
        coords: lat + ',' + lng
      }, cb);
    }
  }
})
