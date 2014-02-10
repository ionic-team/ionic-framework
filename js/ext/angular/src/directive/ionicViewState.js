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
.directive('navBar', ['$ionicViewService', '$rootScope', '$animate', '$compile',
             function( $ionicViewService,   $rootScope,   $animate,   $compile) {

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
    oTitle = $compile('<h1 class="title" bind-html-unsafe="oldTitle"></h1>')($scope);
    title.replaceWith(oTitle);
    nTitle = $compile('<h1 class="title" bind-html-unsafe="currentTitle"></h1>')($scope);

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
    template: '<header class="bar bar-header nav-bar invisible">' +
        '<div class="buttons"> ' +
          '<button view-back class="back-button button hide" ng-if="enableBackButton"></button>' +
          '<button ng-click="button.tap($event)" ng-repeat="button in leftButtons" class="button no-animation {{button.type}}" bind-html-unsafe="button.content"></button>' +
        '</div>' +
        '<h1 class="title" bind-html-unsafe="currentTitle"></h1>' +
        '<div class="buttons" ng-if="rightButtons.length"> ' +
          '<button ng-click="button.tap($event)" ng-repeat="button in rightButtons" class="button no-animation {{button.type}}" bind-html-unsafe="button.content"></button>' +
        '</div>' +
      '</header>',

    compile: function(tElement, tAttrs) {
      var backBtnEle = tElement[0].querySelector('.back-button');
      if(backBtnEle) {
        if(tAttrs.backButtonType) backBtnEle.className += ' ' + tAttrs.backButtonType;

        if(tAttrs.backButtonIcon && tAttrs.backButtonLabel) {
          backBtnEle.innerHTML = '<i class="icon ' + tAttrs.backButtonIcon + '"></i> ' + tAttrs.backButtonLabel;
        } else if(tAttrs.backButtonLabel) {
          backBtnEle.innerHTML = tAttrs.backButtonLabel;
        } else if(tAttrs.backButtonIcon) {
          backBtnEle.className += ' icon ' + tAttrs.backButtonIcon;
        }
      }

      if(tAttrs.type) tElement.addClass(tAttrs.type);

      return function link($scope, $element, $attr) {
        var canHaveBackButton = !(!tAttrs.backButtonType && !tAttrs.backButtonLabel && !tAttrs.backButtonIcon);
        $scope.enableBackButton = canHaveBackButton;

        $rootScope.$on('viewState.showNavBar', function(e, showNavBar) {
          if(showNavBar === false) {
            $element[0].classList.add('invisible');
          } else {
            $element[0].classList.remove('invisible');
          }
        });

        // Initialize our header bar view which will handle resizing and aligning our title labels
        var hb = new ionic.views.HeaderBar({
          el: $element[0],
          alignTitle: $scope.alignTitle || 'center'
        });
        $scope.headerBarView = hb;

        var updateHeaderData = function(data) {
          $scope.oldTitle = $scope.currentTitle;

          $scope.currentTitle = (data && data.title ? data.title : '');

          $scope.leftButtons = data.leftButtons;
          $scope.rightButtons = data.rightButtons;

          if(typeof data.hideBackButton !== 'undefined') {
            $scope.enableBackButton = data.hideBackButton !== true && canHaveBackButton;
          }

          if(data.animate !== false && $attr.animation && data.title && data.navDirection) {

            $element[0].classList.add($attr.animation);
            if(data.navDirection === 'back') {
              $element[0].classList.add('reverse');
            } else {
              $element[0].classList.remove('reverse');
            }

            animate($scope, $element, $scope.oldTitle, data, function() {
              hb.align();
            });
          } else {
            hb.align();
          }
        };

        $rootScope.$on('viewState.viewEnter', function(e, data) {
          updateHeaderData(data);
        });

        $rootScope.$on('viewState.titleUpdated', function(e, data) {
          $scope.currentTitle = (data && data.title ? data.title : '');
        });

        // If a nav page changes the left or right buttons, update our scope vars
        $scope.$parent.$on('viewState.leftButtonsChanged', function(e, data) {
          $scope.leftButtons = data;
        });
        $scope.$parent.$on('viewState.rightButtonsChanged', function(e, data) {
          $scope.rightButtons = data;
        });

      };
    }
  };
}])


.directive('view', ['$ionicViewService', '$rootScope', '$animate',
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
        var deregLeftButtons = $scope.$watch('leftButtons', function(value) {
          $scope.$emit('viewState.leftButtonsChanged', $scope.leftButtons);
        });

        var deregRightButtons = $scope.$watch('rightButtons', function(val) {
          $scope.$emit('viewState.rightButtonsChanged', $scope.rightButtons);
        });

        // watch for changes in the title
        var deregTitle = $scope.$watch('title', function(val) {
          $scope.$emit('viewState.titleUpdated', $scope);
        });

        $scope.$on('$destroy', function(){
          // deregister on destroy
          deregLeftButtons();
          deregRightButtons();
          deregTitle();
        });

      };
    }
  };
}])


.directive('viewBack', ['$ionicViewService', '$rootScope', function($ionicViewService, $rootScope) {
  var goBack = function(e) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    e.alreadyHandled = true;
    return false;
  };

  return {
    restrict: 'AC',
    compile: function(tElement) {
      tElement.addClass('hide');

      return function link($scope, $element) {
        $element.bind('click', goBack);

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


.directive('navView', ['$ionicViewService', '$state', '$compile', '$controller', '$animate',
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
