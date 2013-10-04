angular.module('ionic.ui.sideMenu', [])

.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.SideMenuController.prototype);

  ionic.controllers.SideMenuController.call(this, {
    left: {
      width: 270,
      isEnabled: true,
      pushDown: function() {
        $scope.leftZIndex = -1;
      },
      bringUp: function() {
        $scope.leftZIndex = 0;
      }
    },
    right: {
      width: 270,
      isEnabled: true,
      pushDown: function() {
        $scope.rightZIndex = -1;
      },
      bringUp: function() {
        $scope.rightZIndex = 0;
      }
    }
  });

  $scope.contentTranslateX = 0;
})

.directive('sideMenuCtrl', function() {
  return {
    restrict: 'E',
    controller: 'SideMenuCtrl',
    replace: true,
    transclude: true,
    template: '<div class="view" ng-transclude></div>',
  }
})

.directive('sideMenuContent', function() {
  return {
    restrict: 'CA',
    require: '^sideMenuCtrl',
    scope: true,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        window.ionic.onGesture('drag', function(e) {
          sideMenuCtrl._handleDrag(e);
        }, $element[0]);

        window.ionic.onGesture('release', function(e) {
          sideMenuCtrl._endDrag(e);
        }, $element[0]);

        sideMenuCtrl.setContent({
          onDrag: function(e) {},
          endDrag: function(e) {},
          getTranslateX: function() {
            return $scope.contentTranslateX || 0;
          },
          setTranslateX: function(amount) {
            $scope.contentTranslateX = amount;
            $scope.$apply();
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
      };
    }
  }
})


.directive('menu', function() {
  return {
    restrict: 'E',
    require: '^sideMenuCtrl',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="menu menu-{{side}}" ng-transclude></div>',
    compile: function(element, attr, transclude, sideMenuCtrl) {
      return function($scope, $element, $attr) {
        $scope.side = attr.side;
      };
    }
  }
})
