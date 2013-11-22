(function() {
'use strict';

/**
 * Note: currently unused
 */

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
angular.module('ionic.ui.nav', ['ionic.service.templateLoad', 'ionic.service.gesture', 'ionic.service.platform', 'ngAnimate'])

.controller('NavCtrl', ['$scope', '$element', '$animate', '$compile', '$timeout', 'TemplateLoader', 'Platform', function($scope, $element, $animate, $compile, $timeout, TemplateLoader, Platform) {

  var pushInAnimation = $scope.pushInAnimation || 'slide-in-left';
  var pushOutAnimation = $scope.pushOutAnimation || 'slide-out-left';
  var popInAnimation = $scope.popInAnimation || 'slide-in-right';
  var popOutAnimation = $scope.popOutAnimation || 'slide-out-right';

  // Remove some push classnames
  var cleanElementAnimations = function(el) {
    el.removeClass(pushInAnimation);
    el.removeClass(pushOutAnimation);
    el.removeClass(popInAnimation);
    el.removeClass(popOutAnimation);
  };

  var navController = new ionic.controllers.NavController({
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      show: function() {
        this.isVisible = true;
      },
      hide: function() {
        this.isVisible = false;
      },
      setTitle: function(title) {
        $scope.navController.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  /**
   * Push a template onto the navigation stack.
   * @param {string} templateUrl the URL of the template to load.
   */
  navController.pushFromTemplate = function(templateUrl) {
    var childScope = $scope.$new();
    var last = navController.getTopController();

    // Load the given template
    TemplateLoader.load(templateUrl).then(function(templateString) {

      // Compile the template with the new scope, and append
      // it to the navigation's content area
      var el = $compile(templateString)(childScope, function(cloned, scope) {

        // If there was a last controller, remove it and mark the new
        // one to animate
        if(last) {
          // Push animate
          cleanElementAnimations(last.element);
          $animate.addClass(last.element, pushOutAnimation, function() {
            last.element[0].style.display = 'none';
            last.element.removeClass(pushOutAnimation);
          });

        }


        if(last) {
          // We will need to animate in the new page since we have an old page
          cloned.addClass(pushInAnimation);
          $animate.addClass(cloned, pushInAnimation);
        }

        $animate.enter(cloned, $element, null, function() {
        });

      });
    });
  };

  // Pop function
  navController.popController = function() {
    var last = navController.pop();

    var next = navController.getTopController();

    if(last) {

      cleanElementAnimations(last.element);
      $animate.addClass(last.element, popOutAnimation, function() {
        last.scope.$destroy();
        last.element.remove();
      });
    }

    // Animate the next one in
    if(next) {
      cleanElementAnimations(next.element);
      $animate.addClass(next.element, popInAnimation)
      next.element[0].style.display = 'block';
    }

    $scope.$parent.$broadcast('navigation.pop');
  };

  // Support Android hardware back button (native only, not mobile web)
  var onHardwareBackButton = function(e) {
    $scope.$apply(function() {
      navController.popController();
    });
  };
  Platform.onHardwareBackButton(onHardwareBackButton);


  navController.handleDrag = function(e) {
    // TODO: Support dragging between pages
  };

  navController.endDrag = function(e) {
  };

  /**
   * Push a controller to the stack. This is called by the child
   * nav-content directive when it is linked to a scope on the page.
   */
  $scope.pushController = function(scope, element) {
    navController.push({
      scope: scope,
      element: element
    });
    $scope.$parent.$broadcast('navigation.push', scope);
  };

  $scope.$on('$destroy', function() {
    // Remove back button listener
    Platform.offHardwareBackButton(onHardwareBackButton);
  });

  return $scope.navController = navController;
}])

/**
 * The main directive for the controller.
 */
.directive('navigation', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
    scope: {
      first: '@',
      pushAnimation: '@',
      popAnimation: '@'
    },
    link: function($scope, $element, $attr, navCtrl) {
      $scope.pushAnimation = $scope.pushAnimation || 'slide-in-left';
      $scope.popAnimation = $scope.popAnimation || 'slide-out-left';

      if($scope.first) {
        navCtrl.pushFromTemplate($scope.first);
      }
    }
  };
})

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navigation',
    replace: true,
    scope: {
      type: '@',
      backButtonType: '@',
      backButtonLabel: '@',
      backButtonIcon: '@',
      alignTitle: '@'
    },
    template: '<header class="bar bar-header nav-bar" ng-class="{hidden: !navController.navBar.isVisible}">' + 
        '<button ng-click="goBack()" class="button" ng-if="navController.controllers.length > 1" ng-class="backButtonType" ng-bind-html="backButtonContent"></button>' +
        '<h1 class="title">{{navController.getTopController().scope.title}}</h1>' + 
      '</header>',
    link: function($scope, $element, $attr, navCtrl) {
      var backButton;

      $scope.backButtonContent = '';

      if($scope.backButtonIcon) {
        $scope.backButtonContent += '<i class="icon ' + $scope.backButtonIcon + '"></i>';
      }
      if($scope.backButtonLabel) {
        $scope.backButtonContent += ' ' + $scope.backButtonLabel
      }


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
})

.directive('navPage', ['Gesture', '$animate', '$compile', function(Gesture, $animate, $compile) {

  return {
    restrict: 'AC',
    require: '^navigation',
    link: function($scope, $element, $attr, navCtrl) {
      var lastParent, lastIndex, childScope, childElement;

      // Store that we should go forwards on the animation. This toggles
      // based on the visibility sequence (to support reverse transitions)
      var lastDirection = null;

      $scope.title = $attr.title;

      if($attr.navBar === "false") {
        navCtrl.hideNavBar();
      } else {
        navCtrl.showNavBar();
      }

      $scope.$on('$destroy', function() {
        if(childElement) {
          childElement.remove();
        }
      });
    
      // Push this controller onto the stack
      navCtrl.pushController($scope, $element);
    }
  }
}])

/**
 * Tell the nav controller in the current scope to push a new
 * controller onto the stack, with the given template URL.
 */
.directive('navPush', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var templateUrl = $attr.navPush;

      var pushTemplate = ionic.throttle(function(e) {
        $scope.$apply(function() {
          $scope.navController && $scope.navController.pushFromTemplate(templateUrl);
        });
        return false;
      }, 300, {
        trailing: false
      });

      $element.bind('tap', pushTemplate);

      $scope.$on('$destroy', function() {
        $element.unbind('tap', pushTemplate);
      });
    }
  }
})

/**
 * Tell the nav controller in the current scope to pop the top controller
 * and go back in the stack.
 */
.directive('navPop', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr, navCtrl) {
      var popTemplate = ionic.throttle(function(e) {
        $scope.$apply(function() {
          $scope.navController && navController.pop();
        });
        return false;
      }, 300, {
        trailing: false
      });

      $element.bind('tap', popTemplate);

      $scope.$on('$destroy', function() {
        $element.unbind('tap', popTemplate);
      });
    }
  }
})

})();
