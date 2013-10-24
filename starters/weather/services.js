angular.module('ionic.weather.services', ['ngResource'])

.factory('Geo', function($q) {
  return {
    getLocation: function() {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function(position) {
        q.resolve(position);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  };
})

.factory('Flickr', function($q, $resource, FLICKR_API_KEY) {
  var baseUrl = 'http://api.flickr.com/services/rest/'

  var flickrSearch = $resource(baseUrl + '?method=flickr.photos.search', {
    safe_search: 1,
    callback: 'JSON_CALLBACK',
    api_key: FLICKR_API_KEY
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    search: function(tags, lat, lng, cb) {
      var q = $q.defer();

      flickrSearch.get({
      }, function(val) {
        q.resove(val);
      }, function(httpResponse) {
        q.reject(httpResponse);
      });

      return q.promise;
    }
  };
})

.factory('Weather', function($q, $resource, WUNDERGROUND_API_KEY) {
  var baseUrl = 'http://api.wunderground.com/api/' + WUNDERGROUND_API_KEY;

  var locationResource = $resource(baseUrl + '/geolookup/conditions/q/:coords.json', {
    callback: 'JSON_CALLBACK'
  }, {
    get: {
      method: 'JSONP'
    }
  });

  var forecastResource = $resource(baseUrl + '/forecast/q/:coords.json', {
    callback: 'JSON_CALLBACK'
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    getForecast: function(lat, lng, cb) {
      var q = $q.defer();

      forecastResource.get({
        coords: lat + ',' + lng
      }, function(resp) {
        q.resolve(resp);
      }, function(httpResponse) {
        q.reject(httpResponse);
      });

      return q.promise;
    },

    getAtLocation: function(lat, lng) {
      var q = $q.defer();

      locationResource.get({
        coords: lat + ',' + lng
      }, function(resp) {
        q.resolve(resp);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  }
})
