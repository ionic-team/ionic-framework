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
    },
    content: {
      onDrag: function(e) {},
      endDrag: function(e) {},
      getTranslateX: function() {
        /*
        var r = /translate3d\((-?.+)px/;
        var d = r.exec(this.el.style.webkitTransform);

        if(d && d.length > 0) {
          return parseFloat(d[1]);
        }
        */
        return $scope.contentTranslateX || 0;
      },
      setTranslateX: function(amount) {
        $scope.contentTranslateX = amount;
        $scope.$apply();
      },
      enableAnimation: function() {
        //this.el.classList.add(this.animateClass);
        $scope.animationEnabled = true;
      },
      disableAnimation: function() {
        //this.el.classList.remove(this.animateClass);
        $scope.animationEnabled = false;
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
    template: '<div class="view"><div ng-transclude></div></div>',
  }
})

.directive('sideMenuContent', function() {
  return {
    restrict: 'CA',
    require: '^sideMenuController',
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr, sideMenuCtrl) {
        window.ionic.onGesture('drag', function(e) {
          sideMenuCtrl._handleDrag(e);
        }, $element[0]);

        window.ionic.onGesture('release', function(e) {
          sideMenuCtrl._endDrag(e);
        }, $element[0]);

        $scope.$watch('contentTranslateX', function(value) {
          $element[0].style.webkitTransform = 'translate3d(' + value + 'px, 0, 0)';
        });

        $scope.$watch('animationEnabled', function(isAnimationEnabled) {
          if(isAnimationEnabled) {
            $element[0].classList.add('menu-animated');
          } else {
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
    require: '^sideMenuController',
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
