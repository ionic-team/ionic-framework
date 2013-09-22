angular.module('ionic.ui', [])

.controller('SideMenuCtrl', function($scope) {
  var _this = this;

  angular.extend(this, SideMenuController.prototype);

  SideMenuController.call(this, {
    left: {
      width: 270,
      pushDown: function() {
      },
      bringUp: function() {
      }
    },
    right: {
      width: 270,
      pushDown: function() {
      },
      bringUp: function() {
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
        //this.el.style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
        $scope.contentTranslateX = amount;
      },
      enableAnimation: function() {
        //this.el.classList.add(this.animateClass);
      },
      disableAnimation: function() {
        //this.el.classList.remove(this.animateClass);
      }
    }
  });

  $scope.contentTranslateX = 0;
})

.directive('sideMenuController', function() {
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
          console.log('Translate X changing', value);
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
