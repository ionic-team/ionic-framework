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
 * @ngdoc directive
 * @name ionNavBar
 * @module ionic
 * @restrict E
 *
 * @usage
 * If have an {@link ionic.directive:ionNavView} directive, we can also create an
 * <ion-nav-bar>, which will create a topbar that updates as the application state changes. 
 * We can also add some styles and set up animations:
 * 
 * ```html
 * <body ng-app="starter">
 *   <!-- The nav bar that will be updated as we navigate -->
 *   <ion-nav-bar animation="nav-title-slide-ios7"
 *            type="bar-positive"
 *            back-button-type="button-icon"
 *            back-button-icon="ion-arrow-left-c"></ion-nav-bar>
 * 
 *   <!-- where the initial view template will be rendered -->
 *   <ion-nav-view animation="slide-left-right"></ion-nav-view>
 * </body>
 * ```
 *
 * @param {string=} back-button-type The type of the back button's icon. Available: 'button-icon' or just 'button'.
 * @param {string=} back-button-icon The icon to use for the back button. For example, 'ion-arrow-left-c'.
 * @param {string=} back-button-label The label to use for the back button. For example, 'Back'.
 * @param animation {string=} The animation used to transition between titles. 
 * @param type {string=} The className for the navbar.  For example, 'bar-positive'.
 * @param align {string=} Where to align the title of the navbar. Available: 'left', 'right', 'center'. Defaults to 'center'.
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
        'type="backType" label="backLabel" icon="backIcon" class="hide" ' +
        'ng-class="{\'hide\': !backButtonEnabled}">' +
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

          // only change if they're different
          if($scope.oldTitle !== $scope.title) {
            if (!$scope.animateEnabled) {
              //If no animation, we're done!
              hb.align();
            } else {
              animateTitles();
            }
          }
        }

        function animateTitles() {
          var oldTitleEl, newTitleEl, currentTitles;

          //If we have any title right now (or more than one, they could be transitioning on switch),
          //replace the first one with an oldTitle element
          currentTitles = $element[0].querySelectorAll('.title');
          if (currentTitles.length) {
            oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
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

/**
* @ngdoc directive
* @name ionView
* @module ionic
* @restrict E
*/
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

/**
 * @ngdoc directive
 * @name ionNavView
 * @module ionic
 * @restrict E
 * @codepen HjnFx
 *
 * @description
 * As a user navigates throughout your app, Ionic is able to keep track of their
 * navigation history. By knowing their history, transitions between views
 * correctly slide either left or right, or no transition at all. An additional
 * benefit to Ionic's navigation system is its ability to manage multiple
 * histories.
 *
 * Ionic uses the AngularUI Router module so app interfaces can be organized
 * into various "states". Like Angular's core $route service, URLs can be used
 * to control the views. However, the AngularUI Router provides a more powerful
 * state manager in that states are bound to named, nested, and parallel views,
 * allowing more than one template to be rendered on the same page.
 * Additionally, each state is not required to be bound to a URL, and data can
 * be pushed to each state which allows much flexibility.
 *
 * The ionNavView directive is used to render templates in your application. Each template
 * is part of a state. States are usually mapped to a url, and are defined programatically
 * using angular-ui-router (see [their docs](https://github.com/angular-ui/ui-router/wiki)),
 * and remember to replace ui-view with ion-nav-view in examples).
 *
 * @usage
 * In this example, we will create a navigation view that contains our different states for the app.
 *
 * To do this, in our markup use the ionNavView top level directive, adding an
 * {@link ionic.directive:ionNavBar} directive which will render a header bar that updates as we
 * navigate through the navigation stack.
 *
 * ```html
 * <ion-nav-view>
 *   <!-- Center content -->
 *   <ion-nav-bar>
 *   </ion-nav-bar>
 * </ion-nav-view>
 * ```
 *
 * Next, we need to setup our states that will be rendered.
 *
 * ```js
 * var app = angular.module('myApp', ['ionic']);
 * app.config(function($stateProvider) {
 *   $stateProvider
 *   .state('index', {
 *     url: '/',
 *     templateUrl: 'home.html'
 *   })
 *   .state('music', {
 *     url: '/music',
 *     templateUrl: 'music.html'
 *   });
 * });
 * ```
 * Then on app start, $stateProvider will look at the url, see it matches the index state,
 * and then try to load home.html into the `<ion-nav-view>`.
 *
 * Pages are loaded by the URLs given. One simple way to create templates in Angular is to put
 * them directly into your HTML file and use the `<script type="text/ng-template">` syntax.
 * So here is one way to put home.html into our app:
 *
 * ```html
 * <script id="home" type="text/ng-template">
 *   <!-- The title of the ion-view will be shown on the navbar -->
 *   <ion-view title="'Home'">
 *     <ion-content ng-controller="HomeCtrl">
 *       <!-- The content of the page -->
 *       <a href="#/music">Go to music page!</a>
 *     </ion-content>
 *   </ion-view>
 * </script>
 * ```
 *
 * This is good to do because the template will be cached for very fast loading, instead of
 * having to fetch them from the network.
 *
 * Please visit [AngularUI Router's docs](https://github.com/angular-ui/ui-router/wiki) for
 * more info. Below is a great video by the AngularUI Router guys that may help to explain 
 * how it all works:
 * 
 * <iframe width="560" height="315" src="//www.youtube.com/embed/dqJRoh8MnBo" 
 * frameborder="0" allowfullscreen></iframe>
 *
 * @param {string=} name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states. For more
 * information, see ui-router's [ui-view documentation](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.directive:ui-view).
 * @param {string=} animation The animation to use for views underneath this ionNavView.
 * Defaults to 'slide-left-right'.
 */
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

          var viewHistoryData = $ionicViewService._getViewById(viewRegisterData.viewId) || {};
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
