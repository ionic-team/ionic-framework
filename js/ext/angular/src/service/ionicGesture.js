angular.module('ionic.service.gesture', [])

.factory('Gesture', [function() {
  return {
    on: function(eventType, cb, $element) {
      return window.ionic.onGesture(eventType, cb, $element[0]);
    }
  };
}]);
