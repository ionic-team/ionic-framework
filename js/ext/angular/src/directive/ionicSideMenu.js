(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture', 'ionic.service.view'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */

.run(['$ionicViewService', function($ionicViewService) {
  // set that the side-menus directive should not animate when transitioning to it
  $ionicViewService.disableRegisterByTagName('ion-side-menus');
}])

/**
 * @ngdoc controller
 * @name ionicSideMenus
 * @module ionic
 *
 * @description
 * Controller for the {@link ionic.directive:ionSideMenus} directive.
 */
/**
 * @ngdoc method
 * @name ionicSideMenus#toggleLeft
 * @description Toggle the left side menu (if it exists).
 * @param {boolean=} isOpen Whether to open or close the menu.
 * Default: Toggles the menu.
 */
/**
 * @ngdoc method
 * @name ionicSideMenus#toggleRight
 * @description Toggle the right side menu (if it exists).
 * @param {boolean=} isOpen Whether to open or close the menu.
 * Default: Toggles the menu.
 */
/**
 * @ngdoc method
 * @name ionicSideMenus#isOpenLeft
 * @returns {boolean} Whether the left menu is currently opened.
 */
/**
 * @ngdoc method
 * @name ionicSideMenus#isOpenRight
 * @returns {boolean} Whether the right menu is currently opened.
 */

/**
 * @ngdoc directive
 * @name ionSideMenus
 * @module ionic
 * @restrict E
 * @controller ionicSideMenus as $scope.$ionicSideMenusController
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left
 * and/or right side menu to be toggled by dragging the main content area side
 * to side.
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out the documenation for
 * {@link ionic.directive:ionSideMenuContent} and
 * {@link ionic.directive:ionSideMenu}.
 *
 * @usage
 * To use side menus, add an `<ion-side-menus>` parent element,
 * an `<ion-pane ion-side-menu-content>` for the center content,
 * and one or more `<ion-side-menu>` directives.
 *
 * ```html
 * <ion-side-menus>
 *   <!-- Center content -->
 *   <ion-pane ion-side-menu-content ng-controller="ContentController">
 *   </ion-pane>
 *
 *   <!-- Left menu -->
 *   <ion-side-menu side="left">
 *   </ion-side-menu>
 *
 *   <!-- Right menu -->
 *   <ion-side-menu side="right">
 *   </ion-side-menu>
 * </ion-side-menus>
 * ```
 * ```js
 * function ContentController($scope) {
 *   $scope.toggleLeft = function() {
 *     $scope.$ionicSideMenusController.toggleLeft();
 *   };
 * }
 * ```
 *
 * @param {string=} controller-bind The scope variable to bind these side menus'
 * {@link ionic.controller:ionicSideMenus ionicSideMenus controller} to.
 * Default: $scope.$ionicSideMenusController.
 *
 */
.directive('ionSideMenus', function() {
  return {
    restrict: 'ECA',
    controller: ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
      var _this = this;

      angular.extend(this, ionic.controllers.SideMenuController.prototype);

      ionic.controllers.SideMenuController.call(this, {
        left: { width: 275 },
        right: { width: 275 }
      });

      $scope.sideMenuContentTranslateX = 0;

      $parse($attrs.controllerBind || '$ionicSideMenusController')
        .assign($scope, this);
    }],
    replace: true,
    transclude: true,
    template: '<div class="view" ng-transclude></div>'
  };
})

/**
 * @ngdoc directive
 * @name ionSideMenuContent
 * @module ionic
 * @restrict A
 * @parent ionic.directive:ionSideMenus
 *
 * @description
 * A container for the main visible content, sibling to one or more
 * {@link ionic.directive:ionSideMenu} directives.
 *
 * An attribute directive, recommended to be used as part of an `<ion-pane>` element.
 *
 * @usage
 * ```html
 * <div ion-side-menu-content
 *   drag-content="canDragContent()">
 * </div>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {boolean=} drag-content Whether the content can be dragged.
 *
 */
.directive('ionSideMenuContent', ['$timeout', '$ionicGesture', function($timeout, $ionicGesture) {
  return {
    restrict: 'AC',
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr) {
      return { pre: prelink };
      function prelink($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        if (angular.isDefined(attr.dragContent)) {
          $scope.$watch(attr.dragContent, function(value) {
            $scope.dragContent = value;
          });
        } else {
          $scope.dragContent = true;
        }

        var defaultPrevented = false;
        var isDragging = false;

        // Listen for taps on the content to close the menu
        function contentTap(e) {
          if(sideMenuCtrl.getOpenAmount() !== 0) {
            sideMenuCtrl.close();
            e.gesture.srcEvent.preventDefault();
          }
        }
        ionic.on('tap', contentTap, $element[0]);

        var dragFn = function(e) {
          if($scope.dragContent) {
            if(defaultPrevented || e.gesture.srcEvent.defaultPrevented) {
              return;
            }
            isDragging = true;
            sideMenuCtrl._handleDrag(e);
            e.gesture.srcEvent.preventDefault();
          }
        };

        var dragVertFn = function(e) {
          if(isDragging) {
            e.gesture.srcEvent.preventDefault();
          }
        };

        //var dragGesture = Gesture.on('drag', dragFn, $element);
        var dragRightGesture = $ionicGesture.on('dragright', dragFn, $element);
        var dragLeftGesture = $ionicGesture.on('dragleft', dragFn, $element);
        var dragUpGesture = $ionicGesture.on('dragup', dragVertFn, $element);
        var dragDownGesture = $ionicGesture.on('dragdown', dragVertFn, $element);

        var dragReleaseFn = function(e) {
          isDragging = false;
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        };

        var releaseGesture = $ionicGesture.on('release', dragReleaseFn, $element);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: ionic.animationFrameThrottle(function(amount) {
            $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px, 0, 0)';
            $timeout(function() {
              $scope.sideMenuContentTranslateX = amount;
            });
          }),
          enableAnimation: function() {
            //this.el.classList.add(this.animateClass);
            $scope.animationEnabled = true;
            $element[0].classList.add('menu-animated');
          },
          disableAnimation: function() {
            //this.el.classList.remove(this.animateClass);
            $scope.animationEnabled = false;
            $element[0].classList.remove('menu-animated');
          }
        });

        // Cleanup
        $scope.$on('$destroy', function() {
          $ionicGesture.off(dragLeftGesture, 'dragleft', dragFn);
          $ionicGesture.off(dragRightGesture, 'dragright', dragFn);
          $ionicGesture.off(dragUpGesture, 'dragup', dragFn);
          $ionicGesture.off(dragDownGesture, 'dragdown', dragFn);
          $ionicGesture.off(releaseGesture, 'release', dragReleaseFn);
          ionic.off('tap', contentTap, $element[0]);
        });
      }
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionSideMenu
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionSideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link ionic.directive:ionSideMenuContent} directive.
 *
 * @usage
 * ```html
 * <ion-side-menu
 *   side="left"
 *   width="myWidthValue + 20"
 *   is-enabled="shouldLeftSideMenuBeEnabled()">
 * </ion-side-menu>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {string} side Which side the side menu is currently on.  Allowed values: 'left' or 'right'.
 * @param {boolean=} is-enabled Whether this side menu is enabled.
 * @param {number=} width How many pixels wide the side menu should be.  Defaults to 275.
 */
.directive('ionSideMenu', function() {
  return {
    restrict: 'E',
    require: '^ionSideMenus',
    scope: true,
    compile: function(element, attr) {
      angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
      angular.isUndefined(attr.width) && attr.$set('width', '275');

      element.addClass('menu menu-' + attr.side);

      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side || 'left';

        var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
          width: 275,
          el: $element[0],
          isEnabled: true
        });

        $scope.$watch($attr.width, function(val) {
          var numberVal = +val;
          if (numberVal && numberVal == val) {
            sideMenu.setWidth(+val);
          }
        });
        $scope.$watch($attr.isEnabled, function(val) {
          sideMenu.setIsEnabled(!!val);
        });
      };
    }
  };
})


/**
 * @ngdoc directive
 * @name menuClose
 * @module ionic
 * @restrict AC
 *
 * @description
 * Closes a side menu which is currently opened.
 *
 * @usage
 * Below is an example of a link within a side menu. Tapping this link would
 * automatically close the currently opened menu
 *
 * ```html
 * <a nav-clear menu-close href="#/home" class="item">Home</a>
 * ```
 */
.directive('menuClose', ['$ionicViewService', function($ionicViewService) {
  return {
    restrict: 'AC',
    require: '^ionSideMenus',
    link: function($scope, $element, $attr, sideMenuCtrl) {
      $element.bind('click', function(){
        sideMenuCtrl.close();
      });
    }
  };
}]);

})();
