angular.module('ionic.twitter', ['ngTouch', 'ngResource'])

.factory('TweetSearcher', function($resource) {
  var searchResource = $resource('http://search.twitter.com/:action', {
    action: 'search.json',
    callback:'JSON_CALLBACK'
  }, {
    get: {
      method:'JSONP'
    }
  });

  return {
    search: function(query) {
      return searchResource.query({
        q: 'Cats'
      })
    }
  }
})

.controller('SearchCtrl', function($scope, TweetSearcher) {
  $scope.search = function(query) {
    TweetSearcher.search(query);
  };
});