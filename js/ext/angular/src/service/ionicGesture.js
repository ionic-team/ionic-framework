angular.module('ionic.service.gesture', [])

.factory('$ionicGesture', [function() {
  return {
    on: function(eventType, cb, $element) {
      return window.ionic.onGesture(eventType, cb, $element[0]);
    },
    off: function(gesture, eventType, cb) {
      return window.ionic.offGesture(gesture, eventType, cb);
    }
  };
}]);
