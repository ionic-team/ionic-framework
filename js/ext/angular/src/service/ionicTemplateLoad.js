angular.module('ionic.service.templateLoad', [])

.factory('$ionicTemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: url,
        cache: $templateCache
      }).success(function(html) {
        deferred.resolve(html && html.trim());
      }).error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };
}]);
