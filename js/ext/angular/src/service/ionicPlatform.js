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
.provider('Platform', function() {
  var platform = 'web';
  var isPlatformReady = false;

  if(window.cordova || window.PhoneGap || window.phonegap) {
    platform = 'cordova';
  }

  var isReady = function() {
    if(platform == 'cordova') {
      return window.device || window.Cordova;
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

  // This has been cribbed from angular's sniffer service.
  var vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
      document = window.document,
      bodyStyle = document.body && document.body.style,
      android =
          parseInt((/android (\d+)/.exec(((window.navigator || {}).userAgent).toLowerCase()) || [])[1]),
      vendorPrefix,
      has_transition = false,
      has_animation = false,
      has_transform = false,
      transition = '',
      animation = '',
      transform = '',
      match;
  if (bodyStyle) {
    for(var prop in bodyStyle) {
      if(match = vendorRegex.exec(prop)) {
        vendorPrefix = match[0];
        vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
        break;
      }
    }

    if(!vendorPrefix) {
      vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
    }

    has_transition = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
    has_transform = !!(('transform' in bodyStyle) || (vendorPrefix + 'Transform' in bodyStyle));
    has_animation  = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));
    transition = ('transition' in bodyStyle) ? 'transition' : (vendorPrefix + 'Transition');
    transform = ('transform' in bodyStyle) ? 'transform' : (vendorPrefix + 'Transform');
    animation = ('animation' in bodyStyle) ? 'animation' : (vendorPrefix + 'Animation');

    if (android && (!transitions||!animations)) {
      transitions = isString(document.body.style.webkitTransition);
      animations = isString(document.body.style.webkitAnimation);
    }
  }

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

        /**
         * Trigger a callback once the device is ready, or immediately if the device is already
         * ready.
         */
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
        },
        /**
         * vendor prefix to manipulate browser styles
         */
        vendorPrefix: vendorPrefix,
        has_transition : has_transition,
        has_transform  : has_transform,
        has_animation  : has_animation,
        transition     : transition,
        transform      : transform,
        animation      : animation
      };
    }]
  };
});

})(ionic);
