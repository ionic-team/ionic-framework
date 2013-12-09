angular.module('myApp', ['ionic', 'ngResource'])

.factory('Flickr', function($resource, $q) {
  var photosPublic = $resource('http://api.flickr.com/services/feeds/photos_public.gne', 
      { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
      { 'load': { 'method': 'JSONP' } });
      
  return {
    search: function(query) {
      var q = $q.defer();
      photosPublic.load({
        tags: query
      }, function(resp) {
        q.resolve(resp);
      }, function(err) {
        q.reject(err);
      })
      
      return q.promise;
    }
  }
})
.controller('FlickrCtrl', function($scope, Flickr) {
  var doSearch = ionic.debounce(function(query) {
    Flickr.search(query).then(function(resp) {
      $scope.photos = resp;
    });
  }, 300);
  
  $scope.search = function() {
    doSearch($scope.query);
  }

});