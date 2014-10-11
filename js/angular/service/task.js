/**
 * @ngdoc service
 * @name $ionicTask
 * @module ionic
 * @description
 * A utility for using Web Workers in your apps
 */
IonicModule
.factory('$ionicTask', ['$window', '$q', function($window, $q) {
  return function(scriptPath, onMessage) {
    var worker = new window.Worker(scriptPath);
    var q = $q.defer();

    q.promise.then(function(resolveMessage) {
    }, function(err) {
    }, function(msg) {
      onMessage(msg);
    });

    worker.addEventListener('message', function(e) {
      q.notify(e.data);
    });

    return {
      post: function(data) {
        worker.postMessage(data);
        return q.promise;
      }
    }
  }
}]);
