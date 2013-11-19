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
    // So you can require being under this
    controller: ['$scope', '$element', function($scope, $element) {
      this.navBar = {
        isVisible: true
      };

      $scope.navController = this;
    }],
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

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('navBar', ['$rootScope', function($rootScope) {
  return {
    restrict: 'E',
    require: '^navRouter',
    replace: true,
    scope: {
      type: '@',
      backButtonType: '@',
      backButtonLabel: '@',
      backButtonIcon: '@',
      alignTitle: '@',
    },
    template: '<header class="bar bar-header nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<button ng-click="goBack()" class="button" ng-if="enableBackButton && showBackButton" ng-class="backButtonType" ng-bind-html="backButtonContent"></button>' +
        '<h1 class="title">{{navController.getTopController().scope.title}}</h1>' + 
      '</header>',
    link: function($scope, $element, $attr, navCtrl) {
      var backButton;

      $scope.enableBackButton = true;

      $scope.backButtonContent = '';

      if($scope.backButtonIcon) {
        $scope.backButtonContent += '<i class="icon ' + $scope.backButtonIcon + '"></i>';
      }
      if($scope.backButtonLabel) {
        $scope.backButtonContent += ' ' + $scope.backButtonLabel
      }

      $rootScope.$watch('stackCursorPosition', function(value) {
        if(value > 0) {
          $scope.showBackButton = true;
        } else {
          $scope.showBackButton = false;
        }
        console.log('Stack cursor change', value);
      });

      $scope.navController = navCtrl;

      $scope.goBack = function() {
        navCtrl.popController();
      };


      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$parent.$on('navigation.push', function() {
        backButton = angular.element($element[0].querySelector('.button'));
        backButton.addClass($scope.backButtonType);
        hb.align();
      });
      $scope.$parent.$on('navigation.pop', function() {
        hb.align();
      });

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
}])

.directive('navBack', ['$window', '$rootScope', function($window, $rootScope) {
  return {
    restrict: 'AC',
    require: '^?navRouter',
    link: function($scope, $element, $attr, navCtrl) {
      var goBack = function() {
        // Only trigger back if the stack is greater than zero
        if($rootScope.stackCursorPosition > 0) {
          $window.history.back();
        }
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
