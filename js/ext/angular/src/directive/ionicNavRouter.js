(function() {
'use strict';

/**
 * @description
 * The NavController is a navigation stack View Controller modelled off of 
 * UINavigationController from Cocoa Touch. With the Nav Controller, you can
 * "push" new "pages" on to the navigation stack, and then pop them off to go
 * back. The NavController controls a navigation bar with a back button and title
 * which updates as the pages switch.
 *
 * The NavController makes sure to not recycle scopes of old pages
 * so that a pop will still show the same state that the user left.
 *
 * However, once a page is popped, its scope is destroyed and will have to be
 * recreated then next time it is pushed.
 *
 */

var actualLocation = null;

angular.module('ionic.ui.navRouter', [])

.run(['$rootScope', function($rootScope) {
  $rootScope.stackCursorPosition = 0;
}])

.directive('navRouter', ['$rootScope', '$timeout', '$location', '$window', '$route', function($rootScope, $timeout, $location, $window, $route) {
  return {
    restrict: 'AC',
    link: function($scope, $element, $attr) {
      $scope.animation = $attr.animation;

      $element.addClass('noop-animation');

      var isFirst = true;

      var initTransition = function() {
        //$element.addClass($scope.animation);
      };

      var reverseTransition = function() {
        console.log('REVERSE');
        $element.removeClass('noop-animation');
        $element.removeClass($scope.animation);
        $element.addClass($scope.animation + '-reverse');
      };

      var forwardTransition = function() {
        console.log('FORWARD');
        $element.removeClass('noop-animation');
        $element.removeClass($scope.animation + '-reverse');
        $element.addClass($scope.animation);
      };

      $scope.$on('$routeChangeSuccess', function(e, a) {
        console.log('ROUTE CHANGED', a, e);
      });
      $scope.$on('$routeChangeStart', function(e, a) {
        console.log('ROUTE START', a, e);
        var back, historyState = $window.history.state;

        back = !!(historyState && historyState.position <= $rootScope.stackCursorPosition);

        if(isFirst) {
          // Don't animate
          return;
        }

        if(back) {
          reverseTransition();
        } else {
          forwardTransition();
        }
      });

      $scope.$on('$locationChangeSuccess', function() {
        // Store the new location
        console.log('LOCATION CHANGE SUCCESS');
        $rootScope.actualLocation = $location.path();
        if(isFirst) {
          isFirst = false;
          initTransition();
        }
      });  


      // Keep track of location changes and update a stack pointer that tracks whether we are
      // going forwards or back
      $scope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
        if($rootScope.actualLocation === newLocation) {

          var back, historyState = $window.history.state;

          back = !!(historyState && historyState.position <= $rootScope.stackCursorPosition);

          if (back) {
            //back button
            $rootScope.stackCursorPosition--;
          } else {
            //forward button
            $rootScope.stackCursorPosition++;
          }

        } else {
          var currentRouteBeforeChange = $route.current;

          if (currentRouteBeforeChange) {

            $window.history.replaceState({
              position: $rootScope.stackCursorPosition
            });

            $rootScope.stackCursorPosition++;
          }
        }
      });
    }
  }
}])

.directive('navBack', ['$window', function($window) {
  return {
    restrict: 'AC',
    require: '^?navRouter',
    link: function($scope, $element, $attr, navCtrl) {
      var goBack = function() {
        $window.history.back();
      };
      $element.bind('tap', goBack);
      $element.bind('click', goBack);

      $scope.$on('$destroy', function() {
        $element.unbind('tap', goBack);
        $element.unbind('click', goBack);
      });
    }
  }
}]);

})();
