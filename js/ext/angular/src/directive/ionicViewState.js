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

angular.module('ionic.ui.viewState', ['ionic.service.view', 'ionic.service.gesture', 'ngSanitize'])

/**
 * Our Nav Bar directive which updates as the controller state changes.
 */
.directive('ionNavBar', ['$ionicViewService', '$rootScope', '$animate', '$compile',
                function( $ionicViewService,   $rootScope,   $animate,   $compile) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
      animation: '@',
      type: '@',
      backType: '@backButtonType',
      backLabel: '@backButtonLabel',
      backIcon: '@backButtonIcon',
      alignTitle: '@'
    },
    controller: function() {},
    template:
    '<header class="bar bar-header nav-bar{{navBarClass()}}">' +
      '<ion-nav-back-button ng-if="(backType || backLabel || backIcon)" ' +
        'type="backType" label="backLabel" icon="backIcon" class="opacity-hide" ' +
        'ng-class="{\'opacity-hide\': !backButtonEnabled}">' +
      '</ion-nav-back-button>' +
      '<div class="buttons left-buttons"> ' +
        '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" ' +
          'class="button no-animation {{button.type}}" ng-bind-html="button.content">' +
        '</button>' +
      '</div>' +

      '<h1 ng-bind-html="title" class="title"></h1>' +

      '<div class="buttons right-buttons"> ' +
        '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" '+
          'class="button no-animation {{button.type}}" ng-bind-html="button.content">' +
        '</button>' +
      '</div>' +
    '</header>',
    compile: function(tElement, tAttrs) {

      return function link($scope, $element, $attr) {
        //defaults
        $scope.backButtonEnabled = false;
        $scope.animateEnabled = true;
        $scope.isReverse = false;
        $scope.isInvisible = true;

        $scope.navBarClass = function() {
          return ($scope.type ? ' ' + $scope.type : '') +
            ($scope.isReverse ? ' reverse' : '') +
            ($scope.isInvisible ? ' invisible' : '') +
            (!$scope.animationDisabled && $scope.animation ? ' ' + $scope.animation : '');
        };

        // Initialize our header bar view which will handle
        // resizing and aligning our title labels
        var hb = new ionic.views.HeaderBar({
          el: $element[0],
          alignTitle: $scope.alignTitle || 'center'
        });
        $scope.headerBarView = hb;

        //Navbar events
        $scope.$on('viewState.viewEnter', function(e, data) {
          updateHeaderData(data);
        });
        $scope.$on('viewState.showNavBar', function(e, showNavBar) {
          $scope.isInvisible = !showNavBar;
        });

        // All of these these are emitted from children of a sibling scope,
        // so we listen on parent so we can catch them as they bubble up
        var unregisterEventListeners = [
          $scope.$parent.$on('$viewHistory.historyChange', function(e, data) {
            $scope.backButtonEnabled = !!data.showBack;
          }),
          $scope.$parent.$on('viewState.leftButtonsChanged', function(e, data) {
            $scope.leftButtons = data;
          }),
          $scope.$parent.$on('viewState.rightButtonsChanged', function(e, data) {
            $scope.rightButtons = data;
          }),
          $scope.$parent.$on('viewState.showBackButton', function(e, data) {
            $scope.backButtonEnabled = !!data;
          }),
          $scope.$parent.$on('viewState.titleUpdated', function(e, data) {
            $scope.title = data && data.title || '';
          })
        ];
        $scope.$on('$destroy', function() {
          for (var i=0; i<unregisterEventListeners.length; i++)
            unregisterEventListeners[i]();
        });

        function updateHeaderData(data) {

          if (angular.isDefined(data.hideBackButton)) {
            $scope.backButtonEnabled = !!data.hideBackButton;
          }
          $scope.isReverse = data.navDirection == 'back';
          $scope.animateEnabled = !!(data.navDirection && data.animate !== false);

          $scope.leftButtons = data.leftButtons;
          $scope.rightButtons = data.rightButtons;
          $scope.oldTitle = $scope.title;
          $scope.title = data && data.title || '';

          //If no animation, we're done!
          if (!$scope.animateEnabled) {
            hb.align();
            return;
          } else {
            animateTitles();
          }
        }

        function animateTitles() {
          var oldTitleEl, newTitleEl, currentTitles;

          //If we have any title right now (or more than one, they could be transitioning on switch),
          //replace the first one with an oldTitle element
          currentTitles = $element[0].querySelectorAll('.title');
          if (currentTitles.length) {
            oldTitleEl = $compile('<h1 ng-bind-html="oldTitle" class="title"></h1>')($scope);
            angular.element(currentTitles[0]).replaceWith(oldTitleEl);
          }
          //Compile new title
          newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

          //Animate in one frame
          ionic.requestAnimationFrame(function() {

            oldTitleEl && $animate.leave(angular.element(oldTitleEl));

            var insert = oldTitleEl && angular.element(oldTitleEl) || null;
            $animate.enter(newTitleEl, $element, insert, function() {
              hb.align();
            });

            //Cleanup any old titles leftover (besides the one we already did replaceWith on)
            angular.forEach(currentTitles, function(el) {
              if (el && el.parentNode) {
                //Use .remove() to cleanup things like .data()
                angular.element(el).remove();
              }
            });

            //$apply so bindings fire
            $scope.$digest();

            //Stop flicker of new title on ios7
            ionic.requestAnimationFrame(function() {
              newTitleEl[0].classList.remove('invisible');
            });
          });
        }
      };
    }
  };
}])

.directive('ionNavBarTitle', function() {
  return {
    restrict: 'A',
    require: '^ionNavBar',
    link: function($scope, $element, $attr, navBarCtrl) {
      $scope.headerBarView && $scope.headerBarView.align();
      $element.on('$animate:close', function() {
        $scope.headerBarView && $scope.headerBarView.align();
      });
    }
  };
})

/*
 * Directive to put on an element that has 'invisible' class when rendered.
 * This removes the visible class one frame later.
 * Fixes flickering in iOS7 and old android.
 * Used in title and back button
 */
.directive('ionAsyncVisible', function() {
  return function($scope, $element) {
    ionic.requestAnimationFrame(function() {
      $element[0].classList.remove('invisible');
    });
  };
})

.directive('ionView', ['$ionicViewService', '$rootScope', '$animate',
           function( $ionicViewService,   $rootScope,   $animate) {
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

        $rootScope.$broadcast('viewState.viewEnter', {
          title: $scope.title,
          navDirection: $scope.$navDirection || $scope.$parent.$navDirection
        });

        // Should we hide a back button when this tab is shown
        $scope.hideBackButton = $scope.$eval($scope.hideBackButton);
        if($scope.hideBackButton) {
          $rootScope.$broadcast('viewState.showBackButton', false);
        }

        // Should the nav bar be hidden for this view or not?
        $rootScope.$broadcast('viewState.showNavBar', ($scope.hideNavBar !== 'true') );

        // watch for changes in the left buttons
        $scope.$watch('leftButtons', function(value) {
          $scope.$emit('viewState.leftButtonsChanged', $scope.leftButtons);
        });

        $scope.$watch('rightButtons', function(val) {
          $scope.$emit('viewState.rightButtonsChanged', $scope.rightButtons);
        });

        // watch for changes in the title
        $scope.$watch('title', function(val) {
          $scope.$emit('viewState.titleUpdated', $scope);
        });
      };
    }
  };
}])


.directive('ionNavBackButton', ['$ionicViewService', '$rootScope',
                     function($ionicViewService,   $rootScope) {

  function goBack(e) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    e.alreadyHandled = true;
    return false;
  }

  return {
    restrict: 'E',
    scope: {
      type: '=',
      label: '=',
      icon: '='
    },
    replace: true,
    template:
    '<button ng-click="goBack($event)" class="button back-button {{type}} ' +
      '{{(icon && !label) ? \'icon \' + icon : \'\'}}">' +
      '<i ng-if="icon && label" class="icon {{icon}}"></i> ' +
      '{{label}}' +
    '</button>',
    link: function($scope) {
      $scope.goBack = goBack;
    }
  };
}])

.directive('ionNavView', ['$ionicViewService', '$state', '$compile', '$controller', '$animate',
              function( $ionicViewService,   $state,   $compile,   $controller,   $animate) {
  // IONIC's fork of Angular UI Router, v0.2.7
  // the navView handles registering views in the history, which animation to use, and which
  var viewIsUpdating = false;

  var directive = {
    restrict: 'E',
    terminal: true,
    priority: 2000,
    transclude: true,
    controller: ['$scope', function($scope) {
      this.setNextAnimation = function(anim) {
        $scope.$nextAnimation = anim;
      };
    }],
    compile: function (element, attr, transclude) {
      return function(scope, element, attr, navViewCtrl) {
        var viewScope, viewLocals,
            name = attr[directive.name] || attr.name || '',
            onloadExp = attr.onload || '',
            initialView = transclude(scope);

        // Put back the compiled initial view
        element.append(initialView);

        // Find the details of the parent view directive (if any) and use it
        // to derive our own qualified view name, then hang our own details
        // off the DOM so child directives can find it.
        var parent = element.parent().inheritedData('$uiView');
        if (name.indexOf('@') < 0) name  = name + '@' + (parent ? parent.state.name : '');
        var view = { name: name, state: null };
        element.data('$uiView', view);

        var eventHook = function() {
          if (viewIsUpdating) return;
          viewIsUpdating = true;

          try { updateView(true); } catch (e) {
            viewIsUpdating = false;
            throw e;
          }
          viewIsUpdating = false;
        };

        scope.$on('$stateChangeSuccess', eventHook);
        scope.$on('$viewContentLoading', eventHook);
        updateView(false);

        function updateView(doAnimate) {
          //===false because $animate.enabled() is a noop without angular-animate included
          if ($animate.enabled() === false) {
            doAnimate = false;
          }

          var locals = $state.$current && $state.$current.locals[name];
          if (locals === viewLocals) return; // nothing to do
          var renderer = $ionicViewService.getRenderer(element, attr, scope);

          // Destroy previous view scope
          if (viewScope) {
            viewScope.$destroy();
            viewScope = null;
          }

          if (!locals) {
            viewLocals = null;
            view.state = null;

            // Restore the initial view
            return element.append(initialView);
          }

          var newElement = angular.element('<div></div>').html(locals.$template).contents();
          var viewRegisterData = renderer().register(newElement);

          // Remove existing content
          renderer(doAnimate).leave();

          viewLocals = locals;
          view.state = locals.$$state;

          renderer(doAnimate).enter(newElement);

          var link = $compile(newElement);
          viewScope = scope.$new();

          viewScope.$navDirection = viewRegisterData.navDirection;

          if (locals.$$controller) {
            locals.$scope = viewScope;
            var controller = $controller(locals.$$controller, locals);
            element.children().data('$ngControllerController', controller);
          }
          link(viewScope);

          var viewHistoryData = $ionicViewService._getView(viewRegisterData.viewId) || {};
          viewScope.$broadcast('$viewContentLoaded', viewHistoryData);

          if (onloadExp) viewScope.$eval(onloadExp);

          newElement = null;
        }
      };
    }
  };
  return directive;
}]);

})();
