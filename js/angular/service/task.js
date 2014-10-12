/**
 * @ngdoc service
 * @name $ionicTask
 * @module ionic
 * @description
 * A utility for using Web Workers in your apps
 */
IonicModule
.factory('$ionicTask', ['$log', '$q', function($log, $q) {
  return function(scriptPath, onMessage, onError, onComplete) {
    var worker;
    if(typeof scriptPath === 'string' || scriptPath instanceof String) {
      worker = new window.Worker(scriptPath);
    } else if(window.Blob) {
      // Treat it as a DOM node and "slurp" the script content from it
      var blob = new Blob([scriptPath.textContent]);
      worker = new window.Worker(window.URL.createObjectURL(blob));
    } else {
      $log.error('Unable to create Web Worker. Please specify either a script URL or a valid script as a DOM Element');
      return null;
    }

    var q = $q.defer();

    q.promise.then(function(resolveMessage) {
      onComplete && onComplete(resolveMessage);
    }, function(err) {
      onError && onError(err);
    }, function(msg) {
      onMessage && onMessage(msg);
    });

    worker.addEventListener('message', function(e) {
      q.notify(e.data);
    });

    return {
      post: function(data) {
        worker.postMessage(data);
        return q.promise;
      },

      /**
       * Post a close message to the worker thread. The worker
       * thread must understand this message and call self.close()
       *
       * @param msg the custom message to send, otherwise the message { 'op': 'close' } will be sent.
       */
      close: function(data) {
        worker.postMessage(data || {
          'op': 'close'
        });
        q.resolve();
      },
      terminate: function() {
        worker.terminate();
      }
    }
  }
}])

.factory('$ionicTaskPool', ['$window', '$q', function($window, $q) {
  return function(numWorkers) {
  }
}]);
