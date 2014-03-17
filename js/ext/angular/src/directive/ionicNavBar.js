
angular.module('ionic.ui.navBar', ['ionic.service.view', 'ngSanitize'])

/**
 * @ngdoc controller
 * @name ionicNavBar
 * @module ionic
 * @description
 * Controller for the {@link ionic.directive:ionNavBar} directive.
 */
.controller('$ionicNavBar', ['$scope', '$element', '$ionicViewService', '$animate', '$compile',
function($scope, $element, $ionicViewService, $animate, $compile) {
  //Let the parent know about our controller too so that children of
  //sibling content elements can know about us.
  $element.parent().data('$ionNavBarController', this);

  var hb = this._headerBarView = new ionic.views.HeaderBar({
    el: $element[0],
    alignTitle: $scope.alignTitle || 'center'
  });

  this.leftButtonsElement = angular.element(
    $element[0].querySelector('.buttons.left-buttons')
  );
  this.rightButtonsElement = angular.element(
    $element[0].querySelector('.buttons.right-buttons')
  );

  /**
   * @ngdoc method
   * @name ionicNavBar#back
   * @description Goes back in the view history.
   * @param {DOMEvent=} event The event object (eg from a tap event)
   */
  this.back = function(e) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    e && (e.alreadyHandled = true);
    return false;
  };

  /**
   * @ngdoc method
   * @name ionicNavBar#align
   * @description Calls {@link ionic.controller:ionicBar#align ionicBar#align} for this navBar.
   * @param {string=} direction The direction to the align the title text towards.
   */
  this.align = function(direction) {
    this._headerBarView.align(direction);
  };

  /**
   * @ngdoc method
   * @name ionicNavBar#showBackButton
   * @description
   * Set whether the {@link ionic.directive:ionNavBackButton} should be shown (if it exists).
   * @param {boolean} show Whether to show the back button.
   */
  this.showBackButton = function(show) {
    $scope.backButtonShown = !!show;
  };
  /**
   * @ngdoc method
   * @name ionicNavBar#showBar
   * @description
   * Set whether the {@link ionic.directive:ionNavBar} should be shown.
   * @param {boolean} show Whether to show the bar.
   */
  this.showBar = function(show) {
    $scope.isInvisible = !show;
  };
  /**
   * @ngdoc method
   * @name ionicNavBar#setTitle
   * @description
   * Set the title for the {@link ionic.directive:ionNavBar}.
   * @param {string} title The new title to show.
   */
  this.setTitle = function(title) {
    $scope.oldTitle = $scope.title;
    $scope.title = title || '';
  };
  /**
   * @ngdoc method
   * @name ionicNavBar#changeTitle
   * @description
   * Change the title, transitioning the new title in and the old one out in a given direction.
   * @param {string} title The new title to show.
   * @param {string} direction The direction to transition the new title in.
   * Available: 'forward', 'back'.
   */
  this.changeTitle = function(title, direction) {
    if ($scope.title === title) {
      return false;
    }
    this.setTitle(title);
    $scope.isReverse = direction == 'back';
    $scope.shouldAnimate = !!direction;

    if (!$scope.shouldAnimate) {
      //We're done!
      this._headerBarView.align();
    } else {
      this._animateTitles();
    }
    return true;
  };

  /**
   * @ngdoc method
   * @name ionicNavBar#getTitle
   * @returns {string} The current title of the navbar.
   */
  this.getTitle = function() {
    return $scope.title || '';
  };
  /**
   * @ngdoc method
   * @name ionicNavBar#getPreviousTitle
   * @returns {string} The previous title of the navbar.
   */
  this.getPreviousTitle = function() {
    return $scope.oldTitle || '';
  };

  /**
   * @private
   * Exposed for testing
   */
  this._animateTitles = function() {
    var oldTitleEl, newTitleEl, currentTitles;

    //If we have any title right now
    //(or more than one, they could be transitioning on switch),
    //replace the first one with an oldTitle element
    currentTitles = $element[0].querySelectorAll('.title');
    if (currentTitles.length) {
      oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
      angular.element(currentTitles[0]).replaceWith(oldTitleEl);
    }
    //Compile new title
    newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

    //Animate in on next frame
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
  };
}])

/**
 * @ngdoc directive
 * @name ionNavBar
 * @module ionic
 * @controller ionicNavBar
 * @restrict E
 *
 * @description
 * If we have an {@link ionic.directive:ionNavView} directive, we can also create an
 * `<ion-nav-bar>`, which will create a topbar that updates as the application state changes.
 *
 * We can add a back button by putting an {@link ionic.directive:ionNavBackButton} inside.
 *
 * We can add buttons depending on the currently visible view using
 * {@link ionic.directive:ionNavButtons}.
 *
 * @usage
 *
 * ```html
 * <body ng-app="starter">
 *   <!-- The nav bar that will be updated as we navigate -->
 *   <ion-nav-bar
 *     animation="nav-title-slide-ios7"
 *     class="bar-positive"></ion-nav-bar>
 *
 *   <!-- where the initial view template will be rendered -->
 *   <ion-nav-view animation="slide-left-right"></ion-nav-view>
 * </body>
 * ```
 *
 * @param model {string=} The model to assign the
 * {@link ionic.controller:ionicNavBar ionicNavBar controller} to.
 * Default: assigns it to $scope.navBarController.
 * @param animation {string=} The animation used to transition between titles.
 * @param align {string=} Where to align the title of the navbar.
 * Available: 'left', 'right', 'center'. Defaults to 'center'.
 */
.directive('ionNavBar', ['$ionicViewService', '$rootScope', '$animate', '$compile', '$parse',
function($ionicViewService, $rootScope, $animate, $compile, $parse) {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: '$ionicNavBar',
    scope: {
      animation: '@',
      alignTitle: '@'
    },
    template:
      '<header class="bar bar-header nav-bar{{navBarClass()}}">' +
        '<div class="buttons left-buttons"> ' +
        '</div>' +
        '<h1 ng-bind-html="title" class="title"></h1>' +
        '<div class="buttons right-buttons"> ' +
        '</div>' +
      '</header>',
    compile: function(tElement, tAttrs, transclude) {

      return function link($scope, $element, $attr, navBarCtrl) {
        $parse($attr.model || 'navBarController').assign($scope.$parent, navBarCtrl);

        //Put transcluded content (usually a back button) before the rest
        transclude($scope, function(clone) {
          $element.prepend(clone);
        });

        //defaults
        $scope.backButtonShown = false;
        $scope.shouldAnimate = true;
        $scope.isReverse = false;
        $scope.isInvisible = true;

        $scope.navBarClass = function() {
          return ($scope.isReverse ? ' reverse' : '') +
            ($scope.isInvisible ? ' invisible' : '') +
            ($scope.shouldAnimate && $scope.animation ? ' ' + $scope.animation : '');
        };
      };
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionNavBackButton
 * @module ionic
 * @restrict E
 * @parent ionNavBar
 * @description
 * Creates a back button inside an {@link ionic.directive:ionNavBar}.
 *
 * Will show up when the user is able to go back in the current navigation stack.
 *
 * By default, will go back when clicked.  If you wish for more advanced behavior, see the
 * examples below.
 *
 * @usage
 *
 * With default click action:
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-back-button class="button-icon">
 *     <i class="ion-arrow-left-c"></i> Back!
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 * With custom click action, using {@link ionic.controller:ionicNavBar ionicNavBar controller}:
 *
 * ```html
 * <ion-nav-bar model="navBarController">
 *   <ion-nav-back-button class="button-icon"
 *     ng-click="canGoBack && navBarController.back()">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 * Displaying the previous title on the back button, again using
 * {@link ionic.controller:ionicNavBar ionicNavBar controller}.
 *
 * ```html
 * <ion-nav-bar model="navBarController">
 *   <ion-nav-back-button class="button button-icon ion-arrow-left-c">
 *     {% raw %}{{navBarController.getPreviousTitle() || 'Back'}}{% endraw %}
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 */
.directive('ionNavBackButton', ['$ionicNgClick', function($ionicNgClick) {
  return {
    restrict: 'E',
    require: '^ionNavBar',
    replace: true,
    transclude: true,
    template:
      '<button class="button back-button" ng-transclude>' +
      '</button>',
    link: function($scope, $element, $attr, navBarCtrl) {
      $scope.$navBack = navBarCtrl.back;
      if (!$attr.ngClick) {
        $ionicNgClick($scope, $element, '$navBack($event)');
      }

      //If the current viewstate does not allow a back button,
      //always hide it.
      var deregisterListener = $scope.$parent.$on(
        '$viewHistory.historyChange',
        function(e, data) {
          $scope.hasBackButton = !!data.showBack;
        }
      );
      $scope.$on('$destroy', deregisterListener);

      //Make sure both that a backButton is allowed in the first place,
      //and that it is shown by the current view.
      $scope.$watch('!!(backButtonShown && hasBackButton)', function(val) {
        $element.toggleClass('hide', !val);
      });
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionNavButtons
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * Use ionNavButtons to set the buttons on your {@link ionic.directive:ionNavBar}
 * from within an {@link ionic.directive:ionView}.
 *
 * Any buttons you declare will be placed onto the navbar's corresponding side,
 * and then destroyed when the user leaves their parent view.
 *
 * @usage
 * ```html
 * <ion-nav-bar>
 * </ion-nav-bar>
 * <ion-nav-view>
 *   <ion-view>
 *     <ion-nav-buttons side="left">
 *       <button class="button">
 *         I'm a button on the left of the navbar!
 *       </button>
 *     </ion-nav-buttons>
 *     <ion-content>
 *       Some super content here!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string} side The side to place the buttons on in the parent
 * {@link ionic.directive:ionNavBar}. Available: 'left' or 'right'.
 */
.directive('ionNavButtons', ['$compile', '$animate', function($compile, $animate) {
  return {
    require: '^ionNavBar',
    transclude: true,
    restrict: 'E',
    compile: function($element, $attrs, transclude) {
      return function($scope, $element, $attrs, navBarCtrl) {
        var navElement = $attrs.side === 'right' ?
          navBarCtrl.rightButtonsElement :
          navBarCtrl.leftButtonsElement;

        //Put all of our inside buttons into their own div,
        //so we can remove them all when this element dies -
        //even if the buttons have changed through an ng-repeat or the like,
        //we just remove their div parent and they are gone.
        var clone = angular.element('<div>').append(transclude($scope));
        $animate.enter(clone, navElement);

        //When our ion-nav-buttons container is destroyed,
        //destroy everything in the navbar
        $scope.$on('$destroy', function() {
          $animate.leave(clone);
        });

        //The original element is just a completely empty <ion-nav-buttons></ion-nav-buttons> - make it invisible
        $element.css('display', 'none');
      };
    }
  };
}]);
