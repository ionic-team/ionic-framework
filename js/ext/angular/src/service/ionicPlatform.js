(function() {
'use strict';

angular.module('ionic.platform', [])

/**
 * The platformProvider makes it easy to set and detect which platform
 * the app is currently running on. It has some auto detection built in
 * for PhoneGap and Cordova. This provider also takes care of
 * initializing some defaults that depend on the platform, such as the
 * height of header bars on iOS 7.
 */
.provider('platform', function() {
  var platform = 'unknown';
  var isPlatformReady = false;

  if(window.cordova || window.PhoneGap || window.phonegap) {
    platform = 'cordova';
  }

  console.log('Detected platform', platform);

  var isReady = function() {
    if(platform == 'cordova') {
      return window.device;
    }
    return true;
  };

  // We need to do some stuff as soon as we know the platform,
  // like adjust header margins for iOS 7, etc.
  setTimeout(function afterReadyWait() {
    if(isReady()) {
      ionic.Platform.detect();
    } else {
      setTimeout(afterReadyWait, 50);
    }
  }, 10);

  return {
    setPlatform: function(p) {
      platform = p;
    },
    $get: ['$q', '$timeout', function($q, $timeout) {
      return {
        ready: function(cb) {
          var self = this;
          var q = $q.defer();

          $timeout(function readyWait() {
            if(isReady()) {
              isPlatformReady = true;
              q.resolve();
              cb();
            } else {
              $timeout(readyWait, 50);
            }
          }, 50);

          return q.promise;
        }
      };
    }]
  };
});

})(ionic);
