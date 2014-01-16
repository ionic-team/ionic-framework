(function() {
'use strict';

angular.module('ionic.service.platform', [])

/**
 * The platformProvider makes it easy to set and detect which platform
 * the app is currently running on. It has some auto detection built in
 * for PhoneGap and Cordova. This provider also takes care of
 * initializing some defaults that depend on the platform, such as the
 * height of header bars on iOS 7.
 */
.provider('$ionicPlatform', function() {

  return {
    setPlatform: function(p) {
      platform = p;
    },
    $get: ['$q', '$timeout', function($q, $timeout) {
      return {
        /**
         * Some platforms have hardware back buttons, so this is one way to bind to it.
         *
         * @param {function} cb the callback to trigger when this event occurs
         */
        onHardwareBackButton: function(cb) {
          this.ready(function() {
            document.addEventListener('backbutton', cb, false);
          });
        },

        /**
         * Remove an event listener for the backbutton.
         *
         * @param {function} fn the listener function that was originally bound.
         */
        offHardwareBackButton: function(fn) {
          this.ready(function() {
            document.removeEventListener('backbutton', fn);
          });
        },

        is: function(type) {
          return ionic.Platform.is(type);
        },

        /**
         * Trigger a callback once the device is ready, or immediately if the device is already
         * ready.
         */
        ready: function(cb) {
          var self = this;
          var q = $q.defer();

          $timeout(function readyWait() {
            if(ionic.Platform.isReady) {
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
