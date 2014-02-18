
// Similar to Angular's ngTouch, however it uses Ionic's tap detection
// and click simulation. ngClick 

(function(angular, ionic) {'use strict';


angular.module('ionic.ui.touch', [])

  .config(['$provide', function($provide) {
    $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
      // drop the default ngClick directive
      $delegate.shift();
      return $delegate;
    }]);
  }])

  .directive('ngClick', ['$parse', function($parse) {
    
    function onTap(e) {
      // wire this up to Ionic's tap/click simulation
      ionic.tapElement(e.target, e);
    }

    // Actual linking function.
    return function(scope, element, attr) {

      var clickHandler = $parse(attr.ngClick);

      element.on('click', function(event) {
        scope.$apply(function() {
          clickHandler(scope, {$event: (event)});
        });
      });

      ionic.on('tap', onTap, element[0]);

      // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
      // something else nearby.
      element.onclick = function(event) { };

      scope.$on('$destroy', function () {
        ionic.off('tap', onTap, element[0]);
      });

    };

  }])

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


})(window.angular, window.ionic);
