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

      this.setTitle = function(value) {
        $scope.$broadcast('navRouter.titleChanged', value);
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
        $element.addClass($scope.animation);
        $element.addClass('reverse');
      };

      var forwardTransition = function() {
        console.log('FORWARD');
        $element.removeClass('noop-animation');
        $element.removeClass('reverse');
        $element.addClass($scope.animation);
      };

      $scope.$on('$routeChangeSuccess', function(e, a) {
        console.log('ROUTE CHANGED', a, e);
      });
      $scope.$on('$routeChangeStart', function(e, next, current) {
        console.log('ROUTE START', e, next, current);
        var back, historyState = $window.history.state;

        back = !!(historyState && historyState.position <= $rootScope.stackCursorPosition);

        if(isFirst || (next && next.$$route.originalPath === "")) {
          // Don't animate
          return;
        }

        if(back) {
          reverseTransition();
        } else {
          forwardTransition();
        }
      });

      $scope.$on('$locationChangeSuccess', function(a, b, c) {
        // Store the new location
        console.log('LOCATION CHANGE SUCCESS', a, b, c);
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
.directive('navBar', ['$rootScope', '$animate', function($rootScope, $animate) {
  var animate = function($element, oldTitle, newTitle, cb) {
    if(!oldTitle || oldTitle === newTitle) {
      cb();
      return;
    }

    var title, nTitle, titles = $element[0].querySelectorAll('.title');
    if(titles.length > 1) {
      nTitle = titles[0];
      title = titles[1];
    } else if(titles.length) {
      title = titles[0];
      nTitle = document.createElement('h1');
      nTitle.className = 'title';
      nTitle.appendChild(document.createTextNode(newTitle));

      $animate.enter(angular.element(nTitle), $element, angular.element($element[0].firstElementChild));
      $animate.leave(angular.element(title), function() {
        cb();
      });
    }
  };

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
        '<button nav-back class="button" ng-if="enableBackButton && showBackButton" ng-class="backButtonType" ng-bind-html="backButtonContent"></button>' +
        '<h1 class="title" ng-bind="currentTitle"></h1>' + 
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

      $scope.$parent.$on('navRouter.titleChanged', function(e, value) {
        console.log(value);
        console.log('Title changing from', $scope.currentTitle, 'to', value);
        var oldTitle = $scope.currentTitle;
        animate($element, oldTitle, value, function() {
          $scope.currentTitle = value;
          hb.align();
        });
      });


      /*
      $scope.$parent.$on('navigation.push', function() {
        backButton = angular.element($element[0].querySelector('.button'));
        backButton.addClass($scope.backButtonType);
        hb.align();
      });
      $scope.$parent.$on('navigation.pop', function() {
        hb.align();
      });
      */

      $scope.$on('$destroy', function() {
        //
      });
    }
  };
}])

.directive('navPage', ['$parse', function($parse) {
  return {
    restrict: 'E',
    scope: true,
    require: '^navRouter',
    link: function($scope, $element, $attr, navCtrl) {
      $element.addClass('pane');

      var titleGet = $parse($attr.title);

      $scope.$watch(titleGet, function(value) {
        console.log('Title changed');
        $scope.title = value;
        navCtrl.setTitle(value);
      });

    }
  }
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
