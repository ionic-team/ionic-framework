(function() {
'use strict';

/**
 * @description
 * The sideMenuCtrl lets you quickly have a draggable side
 * left and/or right menu, which a center content area.
 */

angular.module('ionic.ui.sideMenu', ['ionic.service.gesture'])

/**
 * The internal controller for the side menu controller. This
 * extends our core Ionic side menu controller and exposes
 * some side menu stuff on the current scope.
 */
.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    // Our quick implementation of the left side menu
    left: {
      width: 270,
    },

    // Our quick implementation of the right side menu
    right: {
      width: 270,
    }
  });

  $scope.sideMenuContentTranslateX = 0;

  $scope.sideMenuController = this;
})

.directive('sideMenu', function() {
  return {
    restrict: 'ECA',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="pane" ng-transclude></div>'
  };
})

.directive('sideMenuContent', ['Gesture', function(Gesture) {
  return {
    restrict: 'AC',
    require: '^sideMenu',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {

        $element.addClass('menu-content');

        var defaultPrevented = false;

        ionic.on('mousedown', function(e) {
          // If the child element prevented the drag, don't drag
          defaultPrevented = e.defaultPrevented;
        });

        var dragFn = function(e) {
          if(defaultPrevented) {
            return;
          }
          sideMenuCtrl._handleDrag(e);
        };

        Gesture.on('drag', dragFn, $element);

        var dragReleaseFn = function(e) {
          if(!defaultPrevented) {
            sideMenuCtrl._endDrag(e);
          }
          defaultPrevented = false;
        };

        Gesture.on('release', dragReleaseFn, $element);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.sideMenuContentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $scope.sideMenuContentTranslateX = amount;
            $element[0].style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
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
          Gesture.off('drag', dragFn);
          Gesture.off('release', dragReleaseFn);
        });
      };
    }
  };
}])


.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenu',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}"></div>',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        $scope.side = $attr.side;

        sideMenuCtrl.left.pushDown = function() {
          $element[0].style.zIndex = -1;
        };
        sideMenuCtrl.left.bringUp = function() {
          $element[0].style.zIndex = 0;
        };
        sideMenuCtrl.right.pushDown = function() {
          $element[0].style.zIndex = -1;
        };
        sideMenuCtrl.right.bringUp = function() {
          $element[0].style.zIndex = 0;
        };

        if($scope.side == 'left') {
          sideMenuCtrl.left.isEnabled = true;
        } else if($scope.side == 'right') {
          sideMenuCtrl.right.isEnabled = true;
        }

        $element.append(transclude($scope));
      };
    }
  };
});
})();
