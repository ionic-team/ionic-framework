angular.module('ionic.ui.content', {})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: true,
    template: '<div class="content" ng-class="{\'has-header\': hasHeader, \'has-tabs\': hasTabs}"></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
        $scope.hasHeader = attr.hasHeader;
        $scope.hasTabs = attr.hasTabs;

        var newScope = $scope.$parent.$new();

        $element.append(transclude(newScope));
      };
    }
  }
})
;
angular.module('ionic.ui.nav', [])

.controller('NavCtrl', function($scope, $element, $compile) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      setTitle: function(title) {
        $scope.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  $scope.controllers = this.controllers;

  $scope.getTopController = function() {
    return $scope.controllers[$scope.controllers.length-1];
  }

  $scope.pushController = function(controller) {
    _this.push(controller);
  }

  $scope.navController = this;
})

.directive('navController', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div></div>',
    compile: function(element, attr, transclude, navCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  }
})

.directive('navBar', function() {
  return {
    restrict: 'E',
    require: '^navController',
    transclude: true,
    replace: true,
    template: '<header class="bar bar-header bar-dark nav-bar">' + 
        '<a href="#" ng-click="goBack()" class="button" ng-if="controllers.length > 1">Back</a>' +
        '<h1 class="title">{{getTopController().title}}</h1>' + 
      '</header>',
    link: function(scope, element, attrs, navCtrl) {
      scope.goBack = function() {
        navCtrl.pop();
      }
    }
  }
})

.directive('navContent', function() {
  return {
    restrict: 'ECA',
    scope: true,
    link: function(scope, element, attrs) {
      scope.title = attrs.title;
      scope.isVisible = true;
      scope.pushController(scope);
    }
  }
});
;
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
;
angular.module('ionic.ui.tabs', [])

.controller('TabsCtrl', function($scope) {
  var _this = this;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {
        console.log('TAB BAR SET SELECTED INDEX', index);
      },
      addItem: function(item) {
        console.log('TAB BAR ADD ITEM', item);
      }
    }
  });

  $scope.controllers = this.controllers;

  $scope.$watch('controllers', function(newV, oldV) {
    console.log("CControlelrs changed", newV, oldV);
    //$scope.$apply();
  });
})

.directive('tabController', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    transclude: true,
    controller: 'TabsCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view"><div ng-transclude></div><tab-bar></tab-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function($scope, $element, $attr) {
      };
    }
  }
})

// Generic controller directive
.directive('tabContent', function() {
  return {
    restrict: 'CA',
    replace: true,
    transclude: true,
    template: '<div ng-show="isVisible" ng-transclude></div>',
    require: '^tabController',
    scope: true,
    link: function(scope, element, attrs, tabsCtrl) {
      scope.title = attrs.title;
      scope.icon = attrs.icon;
      tabsCtrl.addController(scope);
    }
  }
})


.directive('tabBar', function() {
  return {
    restrict: 'E',
    require: '^tabController',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs tabs-primary">' + 
      '<tab-item title="{{controller.title}}" icon="{{controller.icon}}" active="controller.isVisible" index="$index" ng-repeat="controller in controllers"></tab-item>' + 
    '</div>'
  }
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabController',
    scope: {
      title: '@',
      icon: '@',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      console.log('Linked item', scope);
      scope.selectTab = function(index) {
        tabsCtrl.selectController(scope.index);
      };
    },
    template: 
      '<a href="#" ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="{{icon}}"></i> {{title}}' +
      '</a>'
  }
});
;
angular.module('ionic.ui', ['ionic.ui.content', 'ionic.ui.tabs', 'ionic.ui.nav', 'ionic.ui.sideMenu']);
