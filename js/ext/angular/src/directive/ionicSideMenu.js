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
  $ionicViewService.disableRegisterByTagName('side-menus');
}])

.directive('sideMenus', function() {
  return {
    restrict: 'ECA',
    controller: ['$scope', function($scope) {
      var _this = this;

      angular.extend(this, ionic.controllers.SideMenuController.prototype);

      ionic.controllers.SideMenuController.call(this, {
        // Our quick implementation of the left side menu
        left: {
          width: 275,
        },

        // Our quick implementation of the right side menu
        right: {
          width: 275,
        }
      });

      $scope.sideMenuContentTranslateX = 0;

      $scope.sideMenuController = this;
    }],
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  };
})

.directive('sideMenuContent', ['$timeout', '$ionicGesture', function($timeout, $ionicGesture) {
  return {
    restrict: 'AC',
    require: '^sideMenus',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        $scope.dragContent = $scope.$eval($attr.dragContent) === false ? false : true;

        var defaultPrevented = false;
        var isDragging = false;

        // Listen for taps on the content to close the menu
        /*
        ionic.on('tap', function(e) {
          sideMenuCtrl.close();
        }, $element[0]);
        */

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
          setTranslateX: function(amount) {
            window.rAF(function() {
              $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
              $timeout(function() {
                $scope.sideMenuContentTranslateX = amount;
              });
            });
          },
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
        });
      };
    }
  };
}])


.directive('sideMenu', function() {
  return {
    restrict: 'E',
    require: '^sideMenus',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side;

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
          sideMenuCtrl.left.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.left.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
          sideMenuCtrl.right.pushDown = function() {
            $element[0].style.zIndex = -1;
          };
          sideMenuCtrl.right.bringUp = function() {
            $element[0].style.zIndex = 0;
          };
        }

        $element.append(transclude($scope));
      };
    }
  };
});
})();
