angular.module('ionic.ui', ['ionic.ui.content', 'ionic.ui.tabs', 'ionic.ui.nav', 'ionic.ui.sideMenu']);
;
;
;
angular.module('ionic.service', [])

.factory('TemplateLoader', ['$q', '$http', '$templateCache', function($q, $http, $templateCache) {
  return {
    load: function(url) {
      var deferred = $q.defer();

      $http.get(url, { cache: $templateCache }).success(function(html) {
        deferred.resolve(html && html.trim());
      });

      return deferred.promise;
    }
  }
}]);
;
angular.module('ionic.ui.content', {})

// The content directive is a core scrollable content area
// that is part of many View hierarchies
.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: false,
    compile: function(element, attr, transclude) {
      return function($scope, $element, $attr) {
        $element.addClass('content');

        if(attr.hasHeader) {
          $element.addClass('has-header');
        }
        if(attr.hasTabs) {
          $element.addClass('has-tabs');
        }
      }
    }
  }
})
;
angular.module('ionic.ui.nav', ['ionic.service'])

.controller('NavCtrl', ['$scope', '$element', '$compile', 'TemplateLoader', function($scope, $element, $compile, TemplateLoader) {
  var _this = this;

  angular.extend(this, ionic.controllers.NavController.prototype);

  this.pushFromTemplate = function(tmpl) {
    data = TemplateLoader.load(tmpl).then(function(data) {
      console.log('Nav loaded template', data);

      var childScope = $scope.$new();
      childScope.isVisible = true;
      
      $compile(data)(childScope, function(cloned, scope) {
        $element.append(cloned);
      });
    });
  }

  ionic.controllers.NavController.call(this, {
    content: {
    },
    navBar: {
      shouldGoBack: function() {
      },
      setTitle: function(title) {
        $scope.navController.title = title;
      },
      showBackButton: function(show) {
      },
    }
  });

  $scope.pushController = function(scope) {
    _this.push(scope);
  };

  $scope.navController = this;
}])

.directive('navCtrl', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'NavCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view" ng-transclude></div>',
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
    scope: true,
    template: '<header class="bar bar-header bar-dark nav-bar" ng-class="{hidden: isHidden}">' + 
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

      scope.$watch('isVisible', function(value) {
        console.log('Visiblity changed', value);
        if(value) {
          element[0].classList.remove('hidden');
        } else {
          element[0].classList.add('hidden');
        }
      });
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
