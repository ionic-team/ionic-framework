// Similar to Angular's ngTouch, however it uses Ionic's tap detection
// and click simulation. ngClick

IonicModule

.directive('ionStopEvent', function () {
  function stopEvent(e) {
    e.stopPropagation();
  }
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      element.bind(attr.ionStopEvent, stopEvent);
    }
  };
});
