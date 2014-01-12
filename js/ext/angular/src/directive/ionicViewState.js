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

angular.module('ionic.ui.viewState', ['ionic.service.view', 'ionic.service.gesture']) 

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('navBar', ['ViewService', '$rootScope', '$animate', '$compile', 
             function( ViewService,   $rootScope,   $animate,   $compile) {

  /**
   * Perform an animation between one tab bar state and the next.
   * Right now this just animates the titles.
   */
  var animate = function($scope, $element, oldTitle, data, cb) {
    var title, nTitle, oTitle, titles = $element[0].querySelectorAll('.title');

    var newTitle = data.title;
    if(!oldTitle || oldTitle === newTitle) {
      cb();
      return;
    }

    // Clone the old title and add a new one so we can show two animating in and out
    // add ng-leave and ng-enter during creation to prevent flickering when they are swapped during animation
    title = angular.element(titles[0]);
    oTitle = $compile('<h1 class="title" ng-bind="oldTitle"></h1>')($scope);
    title.replaceWith(oTitle);
    nTitle = $compile('<h1 class="title" ng-bind="currentTitle"></h1>')($scope);

    var insert = $element[0].firstElementChild || null;

    // Insert the new title
    $animate.enter(nTitle, $element, insert && angular.element(insert), function() {
      cb();
    });

    // Remove the old title
    $animate.leave(angular.element(oTitle), function() {
    });
  };

  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '@',
      backButtonType: '@',
      backButtonLabel: '@',
      backButtonIcon: '@',
      alignTitle: '@'
    },
    template: '<header class="bar bar-header nav-bar" ng-class="{invisible: !showNavBar}">' + 
        '<div class="buttons"> ' +
          '<button view-back class="button" ng-if="enableBackButton" ng-class="backButtonClass" ng-bind-html="backButtonLabel"></button>' +
          '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" class="button no-animation {{button.type}}" ng-bind-html="button.content"></button>' + 
        '</div>' +
        '<h1 class="title" ng-bind="currentTitle"></h1>' + 
        '<div class="buttons" ng-if="rightButtons.length"> ' +
          '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" class="button no-animation {{button.type}}" ng-bind-html="button.content"></button>' + 
        '</div>' +
      '</header>',
    link: function($scope, $element, $attr) {

      // Create the back button content and show/hide it based on scope settings
      $scope.enableBackButton = true;
      $scope.backButtonClass = $attr.backButtonType;
      if($attr.backButtonIcon) {
        $scope.backButtonClass += ' icon ' + $attr.backButtonIcon;
      }

      $scope.showNavBar = true;
      $rootScope.$on('viewState.showNavBar', function(e, data) {
        $scope.showNavBar = data;
      });

      // Initialize our header bar view which will handle resizing and aligning our title labels
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });
      $scope.headerBarView = hb;

      // Add the type of header bar class to this element
      $element.addClass($scope.type);

      var updateHeaderData = function(data) {
        var oldTitle = $scope.currentTitle;
        $scope.oldTitle = oldTitle;

        if(typeof data.title !== 'undefined') {
          $scope.currentTitle = data.title;
        }

        $scope.leftButtons = data.leftButtons;
        $scope.rightButtons = data.rightButtons;

        if(typeof data.hideBackButton !== 'undefined') {
          $scope.enableBackButton = data.hideBackButton !== true;
        }

        if(data.animate !== false && $attr.animation && data.title && data.navDirection) {

          $element[0].classList.add($attr.animation);
          if(data.navDirection === 'back') {
            $element[0].classList.add('reverse');
          } else {
            $element[0].classList.remove('reverse');
          }

          animate($scope, $element, oldTitle, data, function() {
            hb.align();
          });
        } else {
          hb.align();
        }
      };

      $rootScope.$on('viewState.viewEnter', function(e, data) {
        updateHeaderData(data);
      });

      // If a nav page changes the left or right buttons, update our scope vars
      $scope.$parent.$on('viewState.leftButtonsChanged', function(e, data) {
        $scope.leftButtons = data;
      });
      $scope.$parent.$on('viewState.rightButtonsChanged', function(e, data) {
        $scope.rightButtons = data;
      });

    }
  };
}])


.directive('view', ['ViewService', '$rootScope', '$animate', 
           function( ViewService,   $rootScope,   $animate) {
  return {
    restrict: 'EA',
    priority: 1000,
    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '=',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      type: '@',
      alignTitle: '@',
      hideBackButton: '@',
      hideNavBar: '@',
      animation: '@'
    },

    compile: function(tElement, tAttrs, transclude) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');

      return function link($scope, $element, $attr) {
        // Should we hide a back button when this tab is shown
        $scope.hideBackButton = $scope.$eval($scope.hideBackButton);
        if($scope.hideBackButton) {
          $rootScope.$broadcast('viewState.showBackButton', false);
        }

        // Should the nav bar be hidden for this view or not?
        $scope.hideNavBar = $scope.$eval($scope.hideNavBar);
        $rootScope.$broadcast('viewState.showNavBar', !$scope.hideNavBar);

        // watch for changes in the left buttons
        $scope.$watch('leftButtons', function(value) {
          $scope.$emit('viewState.leftButtonsChanged', $scope.leftButtons);
        });

        $scope.$watch('rightButtons', function(val) {
          $scope.$emit('viewState.rightButtonsChanged', $scope.rightButtons);
        });

      };
    }
  };
}])


.directive('viewBack', ['ViewService', '$rootScope', function(ViewService, $rootScope) {
  var goBack = function(e) {
    var backView = ViewService.getBackView();
    backView && backView.go();
    e.alreadyHandled = true;
    return false;
  };

  return {
    restrict: 'AC',
    compile: function(tElement) {
      tElement.addClass('hide');

      return function link($scope, $element) {
        $element.bind('tap', goBack);

        $scope.showButton = function(val) {
          if(val) {
            $element[0].classList.remove('hide');
          } else {
            $element[0].classList.add('hide');
          }
        };

        $rootScope.$on('$viewHistory.historyChange', function(e, data) {
          $scope.showButton(data.showBack);
        });

        $rootScope.$on('viewState.showBackButton', function(e, data) {
          $scope.showButton(data);
        });

      };
    }

  };
}])


.directive('navView', ['ViewService', '$state', '$anchorScroll', '$compile', '$controller', '$animate', 
              function( ViewService,   $state,   $anchorScroll,   $compile,   $controller,   $animate) {

  var viewIsUpdating = false;
  var animation;

  var directive = {
    restrict: 'E',
    terminal: true,
    priority: 2000,
    transclude: true,

    link: function(scope, $element, attr, ctrl, $transclude) {
      var currentElement,
          autoScrollExp = attr.autoscroll,
          onloadExp = attr.onload || '',
          viewLocals,
          viewScope,
          name = attr[directive.name] || attr.name || '',
          parent = $element.parent().inheritedData('$uiView');

      if (name.indexOf('@') < 0) name = name + '@' + (parent ? parent.state.name : '');
      var view = { name: name, state: null, animation: null };
      $element.data('$uiView', view);

      var climbElement = $element[0];
      while(!animation && climbElement) {
        animation = climbElement.getAttribute('animation');
        climbElement = climbElement.parentElement;
      }

      var eventHook = function() {
        if (viewIsUpdating) return;
        viewIsUpdating = true;

        try { update(true); } catch (e) {
          viewIsUpdating = false;
          throw e;
        }
        viewIsUpdating = false;
      };

      scope.$on('$stateChangeSuccess', eventHook);
      scope.$on('$viewContentLoading', eventHook);
      update(false);

      function update(doAnimation) {
        var locals = $state.$current && $state.$current.locals[name],
            template = (locals && locals.$template ? locals.$template : null);

        if (locals === viewLocals) return; // nothing to do here, go about your business

        var transitionOptions = {
          parentElement: $element,
          doAnimation: doAnimation,
          leavingScope: viewScope,
          leavingElement: currentElement,
          navDirection: null
        };

        if (template) {
          currentElement = angular.element(template.trim());

          var registerData = {};
          if(currentElement[0].tagName !== 'TABS') {
            // the tabs directive shouldn't register in the view history (its tab will)
            registerData = ViewService.register(scope);
            transitionOptions.navDirection = registerData.navDirection;
          }

          viewLocals = locals;
          view.state = locals.$$state;

          var link = $compile(currentElement),
              current = $state.current;

          viewScope = current.scope = scope.$new();

          if (locals.$$controller) {
            locals.$scope = viewScope;
            var controller = $controller(locals.$$controller, locals);
            if (current.controllerAs) {
              viewScope[current.controllerAs] = controller;
            }
            currentElement.data('$ngControllerController', controller);
            currentElement.children().data('$ngControllerController', controller);
          }

          link(viewScope);

          viewScope.$emit('$viewContentLoaded');
          viewScope.$eval(onloadExp);
          viewScope.animation = animation;

          transitionOptions.enteringScope = viewScope.$$childHead;
          transitionOptions.enteringElement = currentElement;
        }

        ViewService.transition(transitionOptions);
      }
    }
  };
  return directive;
}]);


})();