angular.module('ionic.service.templateLoad', [])

/**
 * @private
 */
.factory('$ionicTemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      return $http.get(url, {cache: $templateCache})
      .then(function(response) {
        return response.data && response.data.trim();
      });
    }
  };
}]);
