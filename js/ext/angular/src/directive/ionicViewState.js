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

angular.module('ionic.ui.viewState', ['ionic.service.view', 'ionic.service.gesture', 'ionic.ui.bindHtml'])

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
    '<header class="bar bar-header nav-bar {{type}} {{isReverse ? \'reverse\' : \'\'}} ' +
    '{{isInvisible ? \'invisible\' : \'\'}} {{animateEnabled ? animation : \'\'}}">' +

      '<ion-nav-back-button ng-if="backButtonEnabled && (backType || backLabel || backIcon)" ' +
        'type="backType" label="backLabelIsPreviousTitle ? previousTitle : backLabel" ' +
        'icon="backIcon" class="invisible" ion-async-visible>' +
      '</ion-nav-back-button>' +

      '<div class="buttons left-buttons"> ' +
        '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" ' +
          'class="button no-animation {{button.type}}" ion-bind-html-unsafe="button.content">' +
        '</button>' +
      '</div>' +

      //ng-repeat makes it easy to add new / remove old and have proper enter/leave anims
      '<h1 ng-repeat="title in titles" ion-bind-html-unsafe="title" class="title invisible" ion-async-visible ion-nav-bar-title></h1>' +

      '<div class="buttons right-buttons" ng-if="rightButtons.length"> ' +
      '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" '+
        'class="button no-animation {{button.type}}" ion-bind-html-unsafe="button.content">' +
        '</button>' +
      '</div>' +
    '</header>',
    compile: function(tElement, attrs) {

      return function link($scope, $element, $attr) {
        ionic.Platform.ready(function() {
          if (angular.isUndefined($attr.backButtonType)) {
            $scope.backType = 'button-icon';
            $scope.backIcon = ionic.Platform.isAndroid() ?
              'ion-chevron-left' :
              'ion-ios7-arrow-back';
            $scope.backLabelIsPreviousTitle = true;
          }
          if (angular.isUndefined($attr.animation)) {
            $scope.animation = 'nav-title-slide-ios7';
          }
        });

        $scope.titles = [];
        //defaults
        $scope.backButtonEnabled = true;
        $scope.animateEnabled = true;
        $scope.isReverse = false;
        $scope.isInvisible = true;

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
          $scope.$parent.$on('viewState.titleUpdated', function(e, title) {
            setTitle(title);
          })
        ];
        $scope.$on('$destroy', function() {
          for (var i=0; i<unregisterEventListeners.length; i++)
            unregisterEventListeners[i]();
        });

        function setTitle(title) {
          $scope.previousTitle = $scope.titles.pop() || '';
          $scope.titles = [title || ''];
        }

        function updateHeaderData(data) {
          $scope.isReverse = data.navDirection == 'back';

          if (data.hideBackButton) {
            $scope.backButtonEnabled = false;
          }

          $scope.animateEnabled = !!(data.navDirection && data.animate !== false);
          $scope.leftButtons = data.leftButtons;
          $scope.rightButtons = data.rightButtons;
          setTitle(data.title);
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
        var initialTitle = $scope.title;

        $rootScope.$broadcast('viewState.viewEnter', {
          title: initialTitle,
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

        // watch for changes in the title.
        // Don't emit unless the title is different from the initial value
        // This stops double emit of title from viewState.viewEnter and then this watch
        $scope.$watch('title', function(val) {
          if (val != initialTitle) {
            $scope.$emit('viewState.titleUpdated', $scope.title);
          }
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
    controller: function() {}, //noop controller so this can be required
    compile: function (element, attr, transclude) {
      return function(scope, element, attr) {
        ionic.Platform.ready(function() {
          if (angular.isUndefined(attr.animation)) {
            attr.$set('animation', true ?
                      'slide-left-right' :
                      'slide-left-right-ios7', true);
          }
        });

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
